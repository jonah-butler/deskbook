function sortDataAZ(data) {
  return data.sort(function(a,b) {
    if(`${a.library.toUpperCase()} ${a.subLocation.toUpperCase()}` < `${b.library.toUpperCase()} ${b.subLocation.toUpperCase()}`){
      return -1;
    }
    if(`${a.library.toUpperCase()} ${a.subLocation.toUpperCase()}` > `${b.library.toUpperCase()} ${b.subLocation.toUpperCase()}`){
      return 1;
    }
    return 0;
  })
}

function sortDataZA(data) {
  return data.sort(function(a,b) {
    if(`${a.library.toUpperCase()} ${a.subLocation.toUpperCase()}` > `${b.library.toUpperCase()} ${b.subLocation.toUpperCase()}`){
      return -1;
    }
    if(`${a.library.toUpperCase()} ${a.subLocation.toUpperCase()}` < `${b.library.toUpperCase()} ${b.subLocation.toUpperCase()}`){
      return 1;
    }
    return 0;
  })
}

function setupDataForChart(response) {
  let valueObj = {};
  response.forEach((val) => {
    if(val.library == "main"){
      if(valueObj[`${val.library} ${val.subLocation}`] == undefined) {
        valueObj[`${val.library} ${val.subLocation}`] = 1;
      } else {
        valueObj[`${val.library} ${val.subLocation}`] += 1;
      }
    } else {
      if(valueObj[val.library] == undefined){
        valueObj[val.library] = 1;
      } else {
        valueObj[val.library] += 1;
      }
    }
  })
  return valueObj;
}

function setupHourlyDataForChart(response) {
  const valueObj = {};
  valueObj.datasets = [];
  response.forEach((val) => {
    let hour = new Date(val.createdAt);
    hour = hour.getHours();
    const index = valueObj.datasets.map(obj => obj.label).indexOf(val.library);
    if(index === -1){
      valueObj.datasets.push({
        data: {10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0},
        label: val.library,
        borderColor: generateRandomColor(),
        fill: true,
      })
      valueObj.datasets[valueObj.datasets.length - 1].data[hour] += 1;
    } else {
      valueObj.datasets[index].data[hour] += 1;
    }
  })
  valueObj['timeLabels'] = [10,11,12,13,14,15,16,17,18];
  valueObj.datasets.forEach(obj => {
    obj.data = Object.values(obj.data);
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

function generateRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

export { sortDataAZ, sortDataZA, setupDataForChart, setupHourlyDataForChart, sortDataTimeAsc, sortDataTimeDesc };
