import Image from "next/image";
import styles from "./Responses.module.css";
import Table from "./table/Table";

export default function MainArea() {
  return (
    <div className="bg-[#1A191A] h-screen ">
      <div className={styles.MainAreaTitle}>
        <div className={styles.MainAreaResponse}>Responses</div>
        <div className={styles.MainAreaResponseSearch}>
          <div className={styles.MainAreaResponseSearchIcon}>
            <Image
              src="/search_icon.svg"
              width={16}
              height={18}
              alt="searchIcon"
            />
          </div>
          <div className={styles.MainAreaResponseSearchInput}>
            <input
              type="text"
              name=""
              value=""
              placeholder="123"
              className={styles.MainAreaResponseSearchInputText}
            />
          </div>

          <button className={styles.MainAreaResponseDeleteIcon}>
            <div>
              <Image
                src="/delete_icon.svg"
                width={11}
                height={18}
                alt="deleteIcon"
              />
            </div>
          </button>
        </div>
        <div className={styles.MainAreaResponseFilter}>
          <button className={styles.MainAreaResponseFilterIcon}>
            <div>
              <Image
                src="/mainarea_filter_icon.svg"
                width={22}
                height={22}
                alt="filterIcon"
              />
            </div>

            <span className={styles.MainAreaResponseFilterText}>Filter</span>
          </button>
        </div>
      </div>
      <div className={styles.MainAreaText}>
        Total 13 responses, 8 responses are selected
      </div>
      <div className={styles.MainAreaCreateProposalButton}>
        <div>
          <div className={styles.MainAreaCreateProposalIcon}>
            <Image
              src="/add_icon.svg"
              width={22}
              height={25}
              alt="createProposalIcon"
            />
          </div>
          <button className={styles.MainAreaCreateProposalButtonText}>
            Create a Proposal
          </button>
        </div>
      </div>
      <div className={styles.MainAreaTable}>
        <div className={styles.MaxAreaTableRow}>question</div>
      </div>
      <div className="p-4 m-10 mt-40 ">
        <Table/>
      </div>
    </div>
  );
}
