import { useSelector } from "react-redux";

const Pagination = ({
  currentPage,
  onPageChange,
  activeClass = "bg-gray-900 text-white border-gray-900",
  nextPage = "Next",
  prevPage = "Prev",
  firstPage = "First",
  lastPage = "Last",
}) => {
  const { products, totalPages } = useSelector((state) => state.product);

  if (!products || products.length === 0 || totalPages <= 1) {
    return null;
  }

  const getGenPageNo = () => {
    const pageNo = [];
    const pageWindow = 2;

    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNo.push(i);
    }
    return pageNo;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-1.5 py-6">
      {/* First & Prev buttons */}
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            {firstPage}
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            {prevPage}
          </button>
        </>
      )}

      {/* Page Numbers */}
      {getGenPageNo().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 text-xs font-semibold rounded-lg border transition cursor-pointer flex items-center justify-center ${
            currentPage === page
              ? activeClass
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next & Last buttons */}
      {currentPage < totalPages && (
        <>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            {nextPage}
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            {lastPage}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
