import React from 'react';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white p-5 rounded-lg shadow-lg relative w-[20vw] h-[15vh] flex flex-col justify-center items-center'>
                <h3 className='text-lg font-bold mb-4'>Confirm deletion</h3>
                <p>Are you sure to delete this image?</p>

                <div className='mt-2'>
                    <button className="px-2 py-2 bg-gray-300 text-black mr-4 rounded" onClick={onClose}>Cancel</button>

                    <button className="px-2 py-2 bg-red-500 ml-99 text-white rounded" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    )

}

export default DeleteConfirmationModal;