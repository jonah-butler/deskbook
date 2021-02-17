function sortData(data) {
  return data.sort(function(a,b) {
    if(a.library.toUpperCase() < b.library.toUpperCase()){
      return -1;
    }
    if(a.library.toUpperCase() > b.library.toUpperCase()){
      return 1;
    }
    return 0;
  })
}

function setupDataForChart(response) {
  let valueObj = {};
  response.forEach((val) => {
    if(valueObj[val.library] == undefined){
      valueObj[val.library] = 1;
    } else {
      valueObj[val.library] += 1;
    }
  })
  return valueObj;
}

export { sortData, setupDataForChart };
