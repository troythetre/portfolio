import React from 'react';
import { useState } from 'react';
import img_size1 from '../../../public/images/edit-proposal/img_size1.svg';
import img_size4 from '../../../public/images/edit-proposal/img_size4.svg';
import img_size3 from '../../../public/images/edit-proposal/img_size3.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const MediaLibrary = dynamic(() => import('../../../components/sectionB/MediaLibrary/MediaLibrary'), { ssr: false });

const MediaCard = () => {
	const [prompt, setPrompt] = useState('');
	const [generatedImage, setGeneratedImage] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImage, setUpLoadedImage] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [showSavedMessage, setShowSavedMessage] = useState(false);
	const [showMediaLibrary, setShowMediaLibrary] = useState(false);

	const router = useRouter();

	const handlePromptChange = (e) => setPrompt(e.target.value);

	const handleGenerateImage = async () => {
		if (!prompt) {
			alert('Please enter a prompt');
			return;
		}

		setIsLoading(true);
		try {
			const generatedImageUrl = [
				`/api/generate-image?prompt=${encodeURIComponent(prompt)}&variant=1`,
				`/api/generate-image?prompt=${encodeURIComponent(prompt)}&variant=2`,
				`/api/generate-image?prompt=${encodeURIComponent(prompt)}&variant=3`,
			];
			setGeneratedImage(generatedImageUrl);
		} catch (error) {
			console.error('Image generation error:', error);
			alert('Failed to generate image');
		} finally {
			setIsLoading(false);
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setUpLoadedImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageSelection = (image) => {
		setSelectedImage(image);
	};

	const handleSaveImage = () => {
		if (!selectedImage) {
			alert('Please select an image to save');
			return;
		}
		setShowSavedMessage(true);
	};

	const handleMediaLibraryClick = () => {
		setShowMediaLibrary(true);
	}
	
	return (
		<>
			<div className='w-[641px] h-[886px] relative'>
				<div className='w-[630px] h-[850px] left-[1px] top-0 absolute bg-black rounded-tl-[22.14px] rounded-tr-3xl rounded-bl-[22.14px] rounded-br-[22.14px] shadow'>
					<div className="w-[551.33px] h-[56.57px] left-[45.28px] top-[69.34px] absolute text-white text-5xl font-normal font-['Poppins'] leading-[55.35px] tracking-tight">
						Welcome to AI Media!
					</div>
					<div className='w-[551.33px] h-[153.21px] left-[45.28px] top-[152.09px] absolute'>
						<span
							style={{
								color: 'white',
								fontSize: '22.14px',
								fontWeight: 'normal',
								fontFamily: 'Poppins',
								lineHeight: 'relaxed',
								letterSpacing: 'wide',
							}}
						>
							{' '}
							Turn Your Imagination into Art: Describe, and We&apos;ll Work Our
							Magic! <br />
						</span>
						<span className="text-white text-[18.82px] font-normal font-['Poppins'] leading-normal">
							<br />
							Type something below:
						</span>
						<div className='relative z-0 w-[550px] h-[139px] rounded-[8px] shadow-xl bg-gradient-gold-gbcs mt-8'>
							<textarea 
								className='w-[551px] h-[138px] px-[22px] py-[23px] left-[45px] top-[327px] bg-[#2F2F2F] text-zinc-400 text-[20px] font-normal font-poppins  leading-7 tracking-tight rounded-[8px]  border-none justify-start items-center gap-2.5 inline-flex resize-none'
								value={prompt}
								onChange={handlePromptChange}
							/>
						</div>
					</div>

					<div className='absolute left-[50%] transform -translate-x-1/2 top-[475px] w-full text-center'>
						<input
							id='file-upload'
							type='file'
							accept='image/*'
							className='hidden'
							onChange={handleImageUpload}
						/>
						<span className='text-white text-[20px] font-normal font-["Poppins"]'>
							Or,{' '}
						</span>
						<label
							htmlFor='file-upload'
							className='text-blue-500 cursor-pointer text-[20px] font-normal font-["Poppins"]'
						>
							upload an image
						</label>
						<span className='text-white text-[20px] font-normal font-["Poppins"]'>
							{' '} to edit
						</span>
					</div>
					
					<div className='w-[102px] h-[2.24px] left-[47px] top-[131px] absolute bg-yellow-300 rounded-sm' />
                   <div className="w-[127px] h-[22px] left-[45px] top-[520px] absolute text-white text-xl font-normal font-['Poppins'] leading-[21.03px] tracking-tight">
                       Aspect Ratio
                   </div>
                   <div className='w-[548.01px] h-[140px] left-[46px] top-[571px] absolute'>
                       <div className='w-[140px] h-[140px] left-0 top-0 absolute rounded-md flex-col justify-start items-start inline-flex'>
                           <Image src={img_size1} alt='image' width={140} height={140} />
                       </div>
                       <div className='w-[140px] h-[140px] left-[204px] top-0 absolute rounded-md flex-col justify-start items-start inline-flex'>
                           <Image src={img_size4} alt='image' width={140} height={140} />
                       </div>
                       <div className='w-[140px] h-[140px] left-[409px] top-0 absolute rounded-md flex-col justify-start items-start inline-flex'>
                           <Image src={img_size3} alt='image' width={140} height={140} />
                       </div>
                   </div>

					<div className='w-[225px] h-[47px] absolute left-[204px] bottom-10 justify-center items-center gap-[16.61px] inline-flex'>
						<button 
							onClick={handleGenerateImage}
							disabled={isLoading}
							className=" w-[225px] h-[47px] rounded-2xl bg-black border-solid border-2 border-gold-gradient-gcbs bg-transparent items-center  text-[#FFE34E] text-lg font-sans font-bold ">
						<span className="text-[25px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">{isLoading ? 'Generating...' : 'Create Image'}</span>
						</button>
					</div>

					{uploadedImage && (
						<div className='absolute left-[45px] top-[400px]'>
							<Image
								src={uploadedImage}
								alt='Uploaded Image'
								className='w-[200px] h-[200px] rounded-md object-contain'
								width={200}
								height={200}
							/>
						</div>
					)}

					{generatedImage.length > 0 && (
						<div className='w-[641px] h-[372.28px] left-0 top-[956.72px] absolute'>
							<div className='w-[641px] h-[372.28px] left-0 top-0 absolute bg-black rounded-tl-[22.14px] rounded-tr-3xl rounded-bl-[22.14px] rounded-br-[22.14px] shadow'>
								<button
									onClick={() => setGeneratedImage([])}
									className="absolute top-3 right-3 text-transparent bg-clip-text bg-gradient-gold-gbcs font-bold text-3xl focus:outline-none border-none p-0"
								>
									x
								</button>
							</div>

							<div className='absolute top-[80px] left-0 right-0 w-full flex justify-between space-x-4 px-80'>
								<div className="w-[140px] h-[140px] bg-gray-500 rounded-md"></div>
  								<div className="w-[140px] h-[140px] bg-gray-500 rounded-md"></div>
  								<div className="w-[140px] h-[140px] bg-gray-500 rounded-md"></div>
							</div>

							<div className="absolute top-[80px] left-0 right-0 w-full flex justify-between space-x-4 px-80">
								{generatedImage.map((image, index) => (
									<div
										key={index}
										onClick={() => handleImageSelection(image)}
										className={`w-[130px] h-[130px] rounded-md border-2 ${
											selectedImage === image
												? 'border-white-500'
												: 'border-transparent'
										} cursor-pointer`}
									>
										<Image
											src={image}
											alt={`Generated ${index}`}
											className="w-full h-full object-cover rounded-md"
											width={130}
											height={130}
										/>
									</div>
								))}
							</div>
							<div className="absolute bottom-[60px] left-[195px] w-[251px] h-[42px] px-[37.90px] py-[9px] rounded-[15px] border-2 border-yellow-500 flex justify-center items-center">
								<button
									onClick={handleSaveImage}
									disabled={!selectedImage}
									className="w-[225px] h-[47px] rounded-2xl bg-black border-solid border-2 border-gold-gradient-gcbs bg-transparent items-center text-[#FFE34E] text-lg font-sans font-bold"
								>
									<span className="text-[25px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
										Save Image
									</span>
								</button>
							</div>
						</div>
					)}

					{showSavedMessage && (
						<div className='w-[641px] h-[400px] left-0 top-[1450px] absolute'>
							<div className='w-[641px] h-[372.28px] bg-black rounded-tl-[22.14px] rounded-tr-3xl rounded-bl-[22.14px] rounded-br-[22.14px] shadow'>
								<div className='absolute left-[50%] transform -translate-x-1/2 top-12 w-full text-center'>
									<input
										id='file-upload'
										type='file'
										accept='image/*'
										className='hidden'
										onChange={handleImageUpload}
									/>
									<span className='text-white text-[20px] font-normal font-["Poppins"]'>
										Or,{' '}
									</span>
									<label
										htmlFor='file-upload'
										className='text-blue-500 cursor-pointer text-[20px] font-normal font-["Poppins"]'
									>
										upload an image
									</label>
									<span className='text-white text-[20px] font-normal font-["Poppins"]'>
										{' '} to edit
									</span>
								</div>

								<button
									onClick={() => setShowSavedMessage(false)}
									className="absolute top-3 right-3 text-transparent bg-clip-text bg-gradient-gold-gbcs font-bold text-3xl focus:outline-none border-none p-0"
								>
									x
								</button>
							</div>
							<div className="absolute bottom-[220px] left-[50%] transform -translate-x-1/2 w-[251px] h-[42px] flex justify-center items-center">
								<div className="w-[225px] h-[47px] rounded-2xl bg-black flex justify-center items-center text-lg font-sans font-bold">
									<span className="text-[30px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
										Saved!
									</span>
								</div>
							</div>
							<div className="absolute bottom-[100px] left-[180px] w-[280px] h-[65px] px-[15px] py-[9px] rounded-[15px] border-2 border-yellow-500 flex justify-center items-center">
								<button
									onClick={handleMediaLibraryClick}
									className="w-full h-full rounded-2xl bg-black border-solid border-2 border-gold-gradient-gcbs bg-transparent items-center text-[#FFE34E] text-lg font-sans font-bold"
								>
									<span className="text-[25px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
										Visit Media Library
									</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			{showMediaLibrary && <MediaLibrary onClose={() => setShowMediaLibrary(false)} />}
		</>
	);
};

export default MediaCard;
