type Props = {
  buttonText: string;
  onClick: () => void;
};

export default function PageActions({ buttonText, onClick }: Props) {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={onClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow font-medium"
      >
        {buttonText}
      </button>
    </div>
  );
}