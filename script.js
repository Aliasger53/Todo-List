let addToTaskArea = "";
let num = 0; //used to set div ID's
let deleteList = [];
let allDivId = []; //used for available div ID's after deletion
let chktrue = 0; //used to check wether any Check box is checked or not.
window.onload = function () {
  start();
};

function start() {
  if (localStorage.length > 0) {
    for (y = 1; y <= localStorage.length; y++) {
      allDivId.push(y);
    }
    for (m = 1; m <= localStorage.length; m++) {
      data = localStorage.getItem(`taskStorage-${m}`);
      tskInnerHTML = data.slice(
        data.search('"tskInnerHTML":"') + 16,
        data.search("divClass") - 3
      );
      divClass = data.slice(data.search('divClass":"') + 11, data.length - 2);
      elementCreation(m, tskInnerHTML, divClass);
      num = localStorage.length;
    }
  }
}

function elementCreation(num, addToTaskArea, divClass) {
  // Elment Creation
  let div = document.createElement("div");
  div.className = divClass;
  div.id = num;

  let srNo = document.createElement("label");
  srNo.setAttribute("for", "Sr#");
  srNo.setAttribute("id", "sr" + num);

  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("class", "taskCheck");
  checkBox.setAttribute("name", "taskCheck");
  checkBox.setAttribute("id", "chk " + num);
  checkBox.setAttribute("onclick", "strikeout(this.id)");
  if (div.className == "strike task") {
    checkBox.checked = true;
  }

  let task = document.createElement("label");
  task.setAttribute("for", "task");
  task.setAttribute("id", "tsk" + num);

  //value inputs
  task.innerHTML = addToTaskArea;
  srNo.innerHTML = num + ".";

  //sending to html need to be done only at the time of creation
  document.getElementById("dataIn").appendChild(div);
  document.getElementById(num).appendChild(srNo);
  document.getElementById(num).appendChild(checkBox);
  document.getElementById(num).appendChild(task);
  if (div.className == "strike task") {
    div.className = "task";
    document.getElementById("dataIn").appendChild(div);
    localClassReplace = localStorage.getItem(`taskStorage-${num}`);
    localStorage.removeItem(`taskStorage-${num}`);
    localClassReplace = localClassReplace.replace("strike task", "task");
    localStorage.setItem(`taskStorage-${num}`, localClassReplace);
    strikeout(`chk ${m}`);
  }
}

function addTask() {
  divClass = "task";
  addToTaskArea = document.getElementById("taskInput").value;
  if (addToTaskArea != "") {
    num++;
    elementCreation(num, addToTaskArea, divClass);

    let taskStorage = {
      id: num,
      tskInnerHTML: addToTaskArea,
      divClass: "task",
    };
    localStorage.setItem(`taskStorage-${num}`, JSON.stringify(taskStorage));
  } else {
    alert("Please enter a task to add to list");
  }
  allDivId.push(num);
  document.getElementById("taskInput").value = "";
}

function strikeout(stId) {
  let strikeId = stId.substring(stId.indexOf(" ") + 1);
  let div = document.getElementById(strikeId);
  let storageTask = localStorage.getItem(`taskStorage-${strikeId}`);
  localStorage.removeItem(`taskStorage-${strikeId}`);
  if (div.className == "strike task") {
    div.className = "task";
    storageTask = storageTask.replace("strike task", "task");
    localStorage.setItem(`taskStorage-${strikeId}`, storageTask);
    for (i = 0; i < deleteList.length; i++) {
      if (strikeId == deleteList[i]) {
        allDivId.push(strikeId);
        deleteList.splice(i, 1);
        chktrue--;
      }
    }
  } else {
    div.className = "strike task";
    storageTask = storageTask.replace("task", "strike task");
    localStorage.setItem(`taskStorage-${strikeId}`, storageTask);
    deleteList.push(strikeId);
    chktrue++;

    // removing deleted div ID's from allDivId list
    let allDivIdLen = allDivId.length;
    for (i = 0; i < allDivIdLen; i++) {
      for (j = 0; j < deleteList.length; j++) {
        if (allDivId[i] == deleteList[j]) {
          allDivId.splice(i, 1);
          i = 0;
        }
      }
    }
  }

  //arranging div ids in sequence so that they can be worked upon in sequence removing the same div id issue
  allDivId.sort(); //!important
}

function deleteTask() {
  if (chktrue > 0) {
    num = 0;

    // Deleting the div
    let deleteListLen = deleteList.length;
    for (i = 0; i < deleteListLen; i++) {
      document.getElementById(deleteList[0]).remove();
      localStorage.removeItem(`taskStorage-${deleteList[0]}`);
      deleteList.splice(0, 1);
    }

    //ittration through divs and altering them

    for (k = 0; k < allDivId.length; k++) {
      num++;
      let divId = allDivId[k];
      let div = document.getElementById(divId);
      let storageKey = localStorage.getItem(`taskStorage-${allDivId[k]}`);
      localStorage.removeItem(`taskStorage-${allDivId[k]}`);

      if (div != null) {
        div.id = num;

        let srNo = document.getElementById("sr" + divId);
        srNo.setAttribute("id", "sr" + num);
        srNo.innerHTML = num + ".";

        let check = document.getElementById("chk " + divId);
        check.setAttribute("id", "chk " + num);

        let task = document.getElementById("tsk" + divId);
        task.setAttribute("id", "tsk" + num);

        storageKey = storageKey.replace(allDivId[k], num);
        localStorage.setItem(`taskStorage-${num}`, storageKey);

        //removing changed div ids
        allDivId.splice(k, 1);
        //adding new div id at the bigning
        allDivId.unshift(num);
      }
    }
    //arranging div ids in sequence so that they can be worked upon in sequence removing the same div id issue
    allDivId.sort(); //!important
  } else {
    if (allDivId.length != 0) {
      alert("Plese select a task for deletion");
    } else {
      alert("No task for deletion");
    }
  }

  chktrue = 0; //after deletion resetting the value to avoid double delete button activation
}
