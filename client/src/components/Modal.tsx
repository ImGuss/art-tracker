import { useEffect, useRef } from 'react'

import { X } from 'lucide-react'

import './Modal.css'


interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  const { isOpen, onClose, children } = props

  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }
    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
    
    function handleClose() {
      onClose()
    }

    dialog.addEventListener('close', handleClose)

    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [isOpen, onClose])

  function clickOut(e:React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      className="modal"
      onClick={clickOut}
      ref={dialogRef}
    >
      <button
        className="modal-x-btn"
        onClick={onClose}
      >
        <X size="0.9rem" />
      </button>
      Modal Component
      <div className="modal-children">
        {children}
      </div>
    </dialog>
  )
}

export default Modal