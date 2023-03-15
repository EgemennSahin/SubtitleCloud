import { XCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export const Modal = ({
  text,
  color,
  options,
  body,
}: {
  text?: string;
  color?: "blue" | "red";
  options?: { text: string; onClick: () => void }[];
  body?: { element: React.ReactElement; onSubmit: () => void };
}) => {
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
        {showModal ? (
          <section
            onClick={body ? () => {} : handleModalClick}
            className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
          >
            <div className="flex w-auto flex-col rounded-lg bg-white p-4">
              <button onClick={handleModalClick} className="ml-auto">
                <XCircleIcon className="h-8 w-8 text-slate-400 hover:text-slate-500" />
              </button>
              {options ? (
                <ul className="divide-y divide-gray-200">
                  {options.map((option) => (
                    <button
                      key={option.text}
                      className={`w-full text-slate-600 first:rounded-t-lg last:rounded-b-lg  hover:bg-slate-100`}
                      onClick={option.onClick}
                    >
                      <div className="mx-auto flex items-center justify-between px-8 py-6 text-xl font-semibold uppercase tracking-wide">
                        {option.text}
                      </div>
                    </button>
                  ))}
                </ul>
              ) : body ? (
                <>
                  {body.element}

                  <button
                    onClick={() => {
                      body.onSubmit();
                      handleModalClick();
                    }}
                    className="mt-3 w-full rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <div
                  className={`w-fit rounded-lg border bg-white p-4 ${colorClass} shadow-xl`}
                >
                  <div className="mx-auto flex items-center justify-between px-8 py-4">
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      <strong>Note:</strong> {text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </>
    );
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return { ModalElement, closeModal, openModal };
};
