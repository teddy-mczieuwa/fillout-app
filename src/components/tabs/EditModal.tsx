import React from 'react';

interface EditModalProps {
  editModal: {
    visible: boolean;
    tabId: string;
    title: string;
  };
  modalInputRef: React.RefObject<HTMLInputElement>;
  setEditModal: React.Dispatch<React.SetStateAction<{
    visible: boolean;
    tabId: string;
    title: string;
  }>>;
  handleTabRename: () => void;
  handleModalKeyDown: (e: React.KeyboardEvent) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  editModal,
  modalInputRef,
  setEditModal,
  handleTabRename,
  handleModalKeyDown
}) => {
  if (!editModal.visible) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={() => setEditModal({ ...editModal, visible: false })}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-lg font-medium mb-4">Rename Tab</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleTabRename(); }}>
          <div className="mb-4">
            <label htmlFor="tab-name" className="sr-only">Tab name</label>
            <input
              ref={modalInputRef}
              id="tab-name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editModal.title}
              onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
              onKeyDown={handleModalKeyDown}
              placeholder="Tab name"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
              onClick={() => setEditModal({ ...editModal, visible: false })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
