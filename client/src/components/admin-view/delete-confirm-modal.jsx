import React, { useEffect } from 'react';
import Draggable from 'react-draggable';

/**
 * A modal component for confirming the deletion of an image.
 *
 * Props:
 *   - isOpen: Boolean indicating whether the modal is open.
 *   - onClose: Function to call when the modal is closed.
 *   - onConfirm: Function to call when the deletion is confirmed.
 *   - isDeleting: Boolean indicating whether the deletion is in progress.
 *   - setDeleteImageId: Function to reset the image ID to be deleted.
 *
 * When the modal is open, it displays a confirmation message and two buttons: 
 * "Cancel" to close the modal, and "Delete" to confirm the deletion. The modal is draggable.
 */

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, setDeleteImageId }) {

    if (!isOpen) return null;   

    useEffect(() => {
        return () => {
            setDeleteImageId("");
        }
    },[])

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <Draggable handle='.modal-header'>
                <div className='bg-white p-5 rounded-lg shadow-lg relative  flex flex-col justify-center items-center'>
                    <div className='modal-header w-full cursor-move text-center'>
                        <h3 className='text-lg font-bold mb-4'>Confirm deletion</h3>
                    </div>


                    <p className='text-center'>Are you sure to delete this image?</p>

                    <div className='mt-4 justify-center gap-4'>
                        <button className="px-2 py-2 bg-gray-300 text-black mr-4 rounded" onClick={onClose}>Cancel</button>

                        <button className="px-2 py-2 bg-red-500 ml-99 text-white rounded" onClick={onConfirm} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Draggable>
        </div>
    )

}

export default DeleteConfirmationModal;