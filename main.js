// array
// months in the year
const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
]

// select DOM ref elements
const diary__form = document.querySelector(".diary__form")
const input = document.getElementById("heading-input")
const textarea = document.getElementById("text-content")
const notification = document.querySelector(".diary__notification")
const container = document.querySelector(".diary__contents")
const add_Btn = document.querySelector(".diary__btn")

// GLOBAL VARIABLES
let editing = false,
    editHeading,
    editContent,
    editID = ""

// EVENT LISTENERS
diary__form.addEventListener( "submit", addContent)
window.addEventListener( "DOMContentLoaded", setUpItems)


// FUNCTIONS
// add content
function addContent(e) {
    e.preventDefault()
    const id = String(randomNumber())
    const inputValue = input.value
    const textareaValue = textarea.value

    if((inputValue && textareaValue) && !editing) {
        // date
        const today = new Date()
        const date = today.getDate()
        const month = months[today.getMonth()]
        const year = today.getFullYear()
        const mins = today.getMinutes()
        const hour = today.getHours()
        const dateFormat = `${date}/${month}/${year} ${hour}:${mins}`

        // create content item
        createNotes(id,inputValue,textareaValue,dateFormat)
        displayNotification("content added successfully","success")
        
        // add to local storage
        addToLocalstorage(id,inputValue,textareaValue,dateFormat)
        
        // setUp to default
        setUpToDefault()
    }    
    else if((inputValue && textareaValue) && editing) {
        
       // editing content
       editHeading.textContent = inputValue
       editContent.textContent = textareaValue
       // edit local storage
       editLocalstorage(editID,inputValue,textareaValue)
       setUpToDefault()
    }
    else {
        if(!inputValue && !textareaValue) {
            displayNotification("please enter heading and content!","danger")
        }
        else if(!inputValue) {
            displayNotification("heading required!","danger")
        }
        else if(!textareaValue) {
            displayNotification("content required!","danger")
        }
    }

}
// random number
function randomNumber() {
    return parseInt(Math.random() * 1e10)
}
// message
function displayNotification(message,action) {
   notification.textContent = message
   notification.classList.add(action)

   setTimeout( () => {
       notification.textContent = ""
       notification.classList.remove(action)
   },1500)
}
// create content
function createNotes(id,heading,notes,date) {

   

   const item = `<!-- single content -->
   <article data-id="${id}" class="diary__article">
      <div class="diary__flex diary__flex-margin">
        <div id="buttons">
          <button class="diary__edit">edit</button>
          <button class="diary__delete">del</button>
        </div>
        <p class="diary__date">added on_ <span id="date">${date}</span></p>
      </div>
      <p class="diary__heading">${heading}</p>
      <p class="diary__content">${notes}</p>
   </article>
   <!-- single content END-->`
   container.insertAdjacentHTML("beforeend",item)


   const editBtns = document.querySelectorAll(".diary__edit")
   const delBtns = document.querySelectorAll(".diary__delete")

   editBtns.forEach( editBtn => {
       editBtn.addEventListener( "click", editItem)
   })

   delBtns.forEach( delBtn => {
       delBtn.addEventListener( "click", deleteItem)
   })


}

function deleteItem(e) {
    // delete item
    const parent = e.currentTarget.parentElement.parentElement.parentElement
    const id = parent.dataset.id
    container.removeChild(parent)

    // delete from local storage
    deleteLocalstorage(id)
}

function editItem(e) {
    // edit item
    editElement = e.currentTarget.parentElement.parentElement.parentElement
    editHeading = e.currentTarget.parentElement.parentElement.nextElementSibling
    editContent = e.currentTarget.parentElement.parentElement.nextElementSibling.nextElementSibling
    
    input.value = editHeading.textContent
    textarea.value = editContent.textContent
    editID = editElement.dataset.id
    
    editing = true
    add_Btn.textContent = "edit"

    
}

// local storage
function addToLocalstorage(id,heading,content,date) {
   const item = {id,heading,content,date}
    // get local storage
   const items = getLocalstorage()
   items.push(item)
   // add to local storage
   localStorage.setItem("notes",JSON.stringify(items))

}

function deleteLocalstorage(id) {
    let items = getLocalstorage()
    items = items.filter( item => {
        if(item.id != id) {
            return item
        }
    })
    
    // add items to local storage
    localStorage.setItem("notes",JSON.stringify(items))
}

function editLocalstorage(ID,heading,content) {
   let items = getLocalstorage()
   
   items = items.map( item => {
      if(item.id == ID) {
          item.heading = heading
          item.content = content
      } 
      return item
   })

   // add to local storage.
   localStorage.setItem("notes",JSON.stringify(items))
}

function getLocalstorage() {
  return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : []
}

//SETUP ON PAGE REFRESH
// setUp to default
function setUpToDefault() {
   input.value = ""
   textarea.value = ""
   editing = false
   editHeading = ""
   editContent = ""
   editID = ""
   add_Btn.textContent = "add"
}

function setUpItems() {
    let items = getLocalstorage()
    items.forEach( item => {
        createNotes(item.id,item.heading,item.content,item.date)
    })    
}


