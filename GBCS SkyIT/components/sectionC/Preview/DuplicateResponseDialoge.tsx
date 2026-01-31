import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

const DuplicateResponseDialog = ({ show, onKeep, onReplace }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeep = () => {
    onKeep();
    handleClose();
  };

  const handleReplace = () => {
    onReplace();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle 
        id="alert-dialog-title" 
        style={{ background: '#1A1B1E', color: '#FFFFFF' ,  textAlign: 'center' }} // Set title background to black and text to white
      >
        {"Duplicate response detected!"}
      </DialogTitle>
      <DialogContent style={{ background: '#1A1B1E'}}> {/* Set content background to black */}
        <DialogContentText id="alert-dialog-description" style={{ color: '#FFFFFF',  textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}> 
          Some responses already exist in the current library. Would you like to keep both sets or replace the duplicates?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ background: '#1A1B1E', justifyContent: 'space-between', fontFamily: 'Poppins, sans-serif' }}> 
        <Button 
          onClick={handleKeep} 
          style={{ background: '#1A1B1E', color: '#FFFFFF', border: '2px solid #FFD700' ,  borderRadius: '20px', fontFamily: 'Poppins, sans-serif'}}
        >
          Keep
        </Button>
        <Button 
          onClick={handleReplace} 
          autoFocus
          style={{  background: '#1A1B1E', color: '#FFFFFF', border: '2px solid #FFD700', borderRadius: '20px', fontFamily: 'Poppins, sans-serif'}}
        >
          Replace
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateResponseDialog;






