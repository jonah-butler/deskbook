function sortDataAZ(data) {
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

function sortDataZA(data) {
  return data.sort(function(a,b) {
    if(a.library.toUpperCase() > b.library.toUpperCase()){
      return -1;
    }
    if(a.library.toUpperCase() < b.library.toUpperCase()){
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

function sortDataTimeAsc(data) {
  return data.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
}

function sortDataTimeDesc(data) {
  return data.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  })
}

export { sortDataAZ, sortDataZA, setupDataForChart, sortDataTimeAsc, sortDataTimeDesc };
