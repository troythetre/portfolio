import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const MAX_FILE_SIZE_MB = 50;
const ALLOWED_FILE_TYPES = ["application/vnd.ms-excel", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileDragDrop: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [responseIDs, setResponseIDs] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    checkAndSetFiles(selectedFiles);
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    checkAndSetFiles(droppedFiles);
  };

  const checkAndSetFiles = (fileList: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    for (const file of fileList) {
      const isBelowMaxSize = file.size <= MAX_BYTES;
      const isAllowedType = ALLOWED_FILE_TYPES.includes(file.type);
      const isCSVorXLSorXLSX =
        file.name.toLowerCase().endsWith(".csv") ||
        file.name.toLowerCase().endsWith(".xls") ||
        file.name.toLowerCase().endsWith(".xlsx");

      if (isBelowMaxSize && isCSVorXLSorXLSX && isAllowedType) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    }

    if (invalidFiles.length > 0) {
      setFileSizeError(
        `The following files are invalid: ${invalidFiles
          .map((file) => file.name)
          .join(", ")}`
      );
    } else {
      setFileSizeError(null);
    }

    if (validFiles.length === 0) {
      setFileTypeError(
        "No valid files selected. Please choose files with CSV or XLS extension."
      );
    } else {
      setFileTypeError(null);
    }

    setFiles(validFiles);
  };
  const router = useRouter();

  const handleFileUpload = async () => {
    try {
      // Check if files exist
      if (!files || files.length === 0) {
        console.log("No files selected.");
        return;
      }

      // Process files and set file content to state
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const content = await readFileContent(file);
          return content;
        })
      );
      console.log("FileDragDrop-content*********");
      console.log(fileContents);
      // Navigate to Preview page and pass file contents as query parameter
      router.push({
        pathname: `/team-member/Preview`,
        query: {
          fileContents: JSON.stringify(fileContents),
        },
      });
    } catch (error) {
      console.log("Error while uploading files:", error);
    }
  };

  const readFileContent = async (file: File): Promise<any[]> => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "csv") {
      return readCsvFile(file);
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      return readXlsFile(file);
    } else {
      throw new Error("Unsupported file format");
    }
  };

  const readCsvFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const csvString = event.target.result as string;
          Papa.parse(csvString, {
            header: false, // Treat all rows, including the first, as data
            skipEmptyLines: true, // Ignore empty rows
            complete: (result) => {
              console.log("Raw Parsed CSV Data:", result.data);

              // Extract headers from the first row
              const headers = result.data[0];
              console.log("Headers:", headers);

              // Map remaining rows to objects using the headers
              const formattedData = result.data.slice(1).map((row) => {
                return {
                  Q: row[0], // Map column 1 to Q
                  A: row[1], // Map column 2 to A
                  S: row[2], // Map column 3 to S
                  T: row[3], // Map column 4 to T
                  ST: row[4], // Map column 5 to ST
                };
              });

              console.log("Formatted Data:", formattedData);
              resolve(formattedData);
            },
            error: (error) => {
              reject(error);
            },
          });
        } else {
          reject("Error reading file");
        }
      };
      reader.onerror = () => reject("Error reading file");
      reader.readAsText(file);
    });
  };

  const readXlsFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            blankrows: false,
            //header: 1,
            header: ["Q", "A", "S", "T", "ST"],
          });
          console.log("uploaded data: " + JSON.stringify(data));
          resolve(data);
        } else {
          reject("Error reading file");
        }
      };
      reader.onerror = () => {
        reject("Error reading file");
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="ml-[420px] mr-[40px] mb-[20px] 3xl:ml-[756px] 3xl:mr-[72px] 3xl:mb-[36px]">
      <h1 className="ml-[300px]">Upload your Responses</h1>
      <div
        className="flex justify-center items-center ml-[310px] mt-8 bg-zinc-900 rounded-md text-white p-0 border-dashed border-4 border-[#DEBF1A] flex-col space-y-2 "
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "350px",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mt-0">
          <Image
            src="/images/File_Upload/cloud_upload_outline.svg"
            alt="Upload icon"
            width={80}
            height={71}
          />
        </div>
        <p className="text-xl mb-0 flex flex-col items-center font-normal font-poppins">
          Drag files to upload
        </p>
        <p className="text-xl mb-0 flex flex-col items-center font-normal font-poppins">
          {" "}
          or
        </p>

        <label
          htmlFor="fileInput"
          className="w-260 h-71 rounded-xl bg-gradient-text flex justify-center items-center"
        >
          <span className="sr-only">Upload Files</span>
          <div className="bg-zinc-900 pl-0 pr-2 border-2 border-solid rounded-xl border-[#DEBF1A] w-200 h-70  flex justify-center items-center">
            <p className=" bg-clip-text font-poppins mb-2 mt-2 mx-2 text-transparent bg-gradient-text border-none cursor-pointer text-2xl">
              Browse Files{" "}
            </p>
            <input
              type="file"
              id="fileInput"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
        </label>

        <p className="text-lg mt-0 text-white space-y-[5px]">
          {" "}
          Max File size:{" "}
          <span className="text-white">{MAX_FILE_SIZE_MB} MB</span>
        </p>
        <p className="text-lg mb-2 text-white space-y-[5px]">
          Supported file types: <span className="text-white">CSV, XLS,XLSX</span>
        </p>

        {fileSizeError && <p className="text-red-300">{fileSizeError}</p>}
        {fileTypeError && <p className="text-red-300">{fileTypeError}</p>}

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center">
                <span>{file.name}</span>
                <button
                  onClick={() => handleDeleteFile(index)}
                  className="ml-2 text-red-500 cursor-pointer bg-transparent border-none hover:text-red-700 focus:outline-none"
                >
                  &#10006;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 ml-[91%]">
        <button
          onClick={handleFileUpload}
          className="font-normal font-poppins h-[40px] w-[110px] border-2 border-solid rounded-md px-3 border-[#DEBF1A] bg-clip-text text-transparent bg-gradient-text cursor-pointer text-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FileDragDrop;
