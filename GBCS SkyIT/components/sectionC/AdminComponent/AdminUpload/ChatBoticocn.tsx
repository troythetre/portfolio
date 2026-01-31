import React from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5'; // Importing IoChatboxEllipsesOutline icon
import IconButton from '@mui/material/IconButton';

const ChatbotIcon = ({ onClick }) => {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <div style={{
        display: 'inline-block',
        borderRadius: '50%', // Make the circle
        border: '2px solid #ffd700', // Golden yellow border
        padding: '10px', // Adjust the padding to control the size of the circle
      }}>
        <IconButton
          onClick={onClick}
          color="primary"
          style={{
            backgroundColor: 'transparent', // Set background to transparent
            border: 'none', // Remove border from IconButton
            padding: '0', // Remove padding from IconButton
          }}
        >
          <IoChatboxEllipsesOutline style={{ color: '#ffd700', fontSize: 24 }} /> {/* Set dots color to golden yellow */}
        </IconButton>
      </div>
    </div>
  );
};

export default ChatbotIcon;








