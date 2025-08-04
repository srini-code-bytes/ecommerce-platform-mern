const MinimizedBot = ({ onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-red-800 text-white z-[1000]"
    >
      💬
    </div>
  );
};

export default MinimizedBot;
