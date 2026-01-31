import React from 'react';

interface UndoRedoToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
}

const UndoRedoToolbar: React.FC<UndoRedoToolbarProps> = ({ onUndo, onRedo }) => {
  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
    </div>
  );
};

export default UndoRedoToolbar;
