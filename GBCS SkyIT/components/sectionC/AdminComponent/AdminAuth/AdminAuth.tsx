import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { BASEURL } from '../../../../constants';
interface AdminAuthPopup {
  showpopup: boolean;
  setShowPopup: (showpopup: boolean) => void;
  handleAuthCode: (authCode: string) => void;
}

const AdminAuth: React.FC<AdminAuthPopup> = ({
  showpopup,
  setShowPopup,
  handleAuthCode,
}) => {
  const router = useRouter();
  const [authorizationCode, setAuthorizationCode] = useState<string>('');
  const [open, setOpen] = React.useState(showpopup);
  //const handleClose = () => setShowPopup(false);

  const handleCodeSubmit = async () => {
    handleAuthCode(authorizationCode);
    setShowPopup(false);
  };
  //
  useEffect(() => {
    //setOpen(true);
  }, []);

  return (
    <div className="inset-0 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen overflow-hidden">
        <Modal
          open={open}
          onClose={() => setShowPopup(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 540,
              height: 275,
              bgcolor: 'rgb(38 38 38)',
              borderRadius: '13px',
              boxShadow: 24,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <div className="bg-black p-8 rounded-tr-lg rounded-tl-lg">
                <div className="text-30 font-poppins font-semibold m-0 bg-clip-text text-transparent bg-gradient-text text-center">
                  Authorization code needed
                  <div className="inline-block pl-24 top-2  absolute text-20 text-yellow-300 hover:text-yellow-500">
                    <CloseIcon onClick={() => setShowPopup(false)} />
                  </div>
                </div>
              </div>
            </Typography>

            <div className="text-center mt-10">
              <input
                type="text"
                value={authorizationCode}
                onChange={(e) => setAuthorizationCode(e.target.value)}
                className="w-[463px] h-[64px] border-2 border-b-yellow-color bg-accent-color text-30 font-bold text-white-color rounded-lg outline-none mb-9"
              />

              <div className="flex justify-center">
                <div className="relative">
                  <div className="bg-gradient-border w-[142px] h-[52px] rounded-xl"></div>
                  <button
                    type="submit"
                    onClick={handleCodeSubmit}
                    className="cursor-pointer border-transparent rounded-xl text-25 bg-primary-gbcs-black text-white w-[140px] h-[50px] absolute top-[1px] left-[1px] "
                  >
                    <div className="bg-clip-text text-transparent bg-gradient-text">
                      Next
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAuth;
