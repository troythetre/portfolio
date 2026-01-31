import { useState, useEffect, useRef } from 'react';
import { ReactSVG } from 'react-svg';

interface ToolBarProps {
  onUndo: () => void;
  onRedo: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ onUndo, onRedo }) => {
  const [activeTool, setActiveTool] = useState<string>('selection');
  const [selectedElements, setSelectedElements] = useState<NodeList | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    // Handle tool-specific logic here
    switch (tool) {
      case 'undo':
        // Handle undo logic
        break;
      case 'redo':
        // Handle redo logic
        break;
      case 'selection':
        // Handle selection logic
        selectElements();
        break;
      // Add cases for other tools
      default:
        break;
    }
  };

  const selectElements = () => {
    if (contentRef.current) {
      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        const selectedContent = range.cloneContents();
        setSelectedElements(selectedContent.childNodes);
      }
    }
  };

  useEffect(() => {
    // Handle selected elements, e.g., update styles, etc.
    console.log('Selected Elements:', selectedElements);
  }, [selectedElements]);

  return (
    <div className="flex">
      {/* ... (other buttons) */}
      <ToolButton
        tool="selection"
        icon="/images/edit-proposal/selection.svg"
        onClick={() => handleToolChange('selection')}
        active={activeTool === 'selection'}
      />
      {/* ... (other buttons) */}

      {/* Content editable area */}
      <div
        ref={contentRef}
        className="content-editable"
        contentEditable
        style={{ border: '1px solid #ccc', minHeight: '100px', padding: '8px' }}
      >
        {/* Your HTML content goes here */}
        {/* ... */}
      </div>
    </div>
  );
};

interface ToolButtonProps {
  tool: string;
  icon: string;
  onClick: () => void;
  active: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ tool, icon, onClick, active }) => {
  return (
    <div
      className={`flex rounded-md p-1 mb-4 cursor-pointer items-center gap-x-1 ${
        active ? 'hover:bg-accent-color active' : ''
      } shadow-inner`}
      onClick={onClick}
    >
      <ReactSVG src={icon} style={{ fill: active ? '#FFFFFF' : '#555555' }} />
    </div>
  );
};

export default ToolBar;

