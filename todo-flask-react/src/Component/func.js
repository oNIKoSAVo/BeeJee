
function  func_pagination({sortBy, order, setSortBy, setOrder}) {

    const handleSortBy = (newSortBy) => {
        // Если пользователь нажимает на текущую опцию сортировки, мы меняем порядок
        if (newSortBy === sortBy) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          // Иначе мы устанавливаем новую опцию сортировки и сбрасываем порядок на стандартный
          setSortBy(newSortBy);
          setOrder("asc");
        }
      };
}

export default func_pagination;