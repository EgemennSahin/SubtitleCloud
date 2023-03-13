import { useState } from "react";

export const Modal = (text: string, color: "blue" | "red") => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClick = () => {
    setShowModal(!showModal);
  };

  const ModalElement = () => {
    let colorClass = "text-blue-600";
    switch (color) {
      case "red":
        colorClass = "text-red-600";
        break;
      default:
        colorClass = "text-blue-600";
    }

    return (
      <>
        {showModal && (
          <section
            onClick={handleModalClick}
            className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
          >
            <div
              className={`w-fit rounded-lg border bg-white ${colorClass} shadow-xl`}
            >
              <div className="mx-auto flex items-center justify-between px-12 py-8">
                <div className="flex">
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    <strong>Note:</strong> {text}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  return { ModalElement, closeModal, openModal };
};
