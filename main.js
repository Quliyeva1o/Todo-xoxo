const addInput = document.getElementById("add");
const input = document.getElementById("input");
const warning = document.getElementById("input-warning");
const addedList = document.getElementById("added");
let itemCount = document.getElementById("num");

const productsArray = [];

class Product {
    constructor(productName) {
        this.productName = productName;
        this.isMarked = false;
    }
}
function main() {
    addInput.addEventListener('click', (e) => {
        e.preventDefault();
        addProduct();
    });

    input.addEventListener('keyup', () => {
        if (input.value !== "") {
            warning.classList.replace('d-block', 'd-none');
        }
    });


}


function addProduct() {
    if (input.value === "") {
        warning.classList.replace('d-none', 'd-block');
    } else {
        const newProduct = new Product(input.value);
        productsArray.push(newProduct);
        input.value = "";
        addToDOM(newProduct);
        itemCount.textContent = productsArray.length - countMarkedProducts();

        displaySuccessMessage();
    }
}

function addToDOM(product) {
    const listItem = document.createElement('li');
    listItem.classList.add('d-flex', 'justify-content-between', 'mb-2');
    listItem.innerHTML = `
        <span>${product.productName}</span>
        <div class="btns-wrapper">
            <button class="btn btn-outline-primary mark-as-done"><i class="fa-solid fa-check"></i></button>
            <button class="btn btn-outline-danger delete"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-outline-warning edit"><i class="fa-solid fa-edit"></i></button>
        </div>`;
    addedList.appendChild(listItem);
    addEventListeners(listItem);
}

function displaySuccessMessage() {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "To Do added!",
        showConfirmButton: false,
        timer: 1500
    });
}

function addEventListeners(item) {
    const markAsDoneButton = item.querySelector(".mark-as-done");
    markAsDoneButton.addEventListener('click', markAsDone);

    const deleteButton = item.querySelector(".delete");
    deleteButton.addEventListener('click', deleteItem);

    const editButton = item.querySelector(".edit");
    editButton.addEventListener('click', editItem)

    const clearAllButton = document.getElementById("clear-all");
    clearAllButton.addEventListener("click", clearAllItems);
}



function markAsDone(event) {
    const listItem = event.target.closest('li');
    listItem.querySelector('span').style.textDecoration = 'line-through';
    const productName = listItem.querySelector('span').textContent.trim();
    const productIndex = productsArray.findIndex(product => product.productName === productName);
    if (productIndex !== -1) {
        productsArray[productIndex].isMarked = true;
        itemCount.textContent = productsArray.length - countMarkedProducts();

    }
}


function deleteItem(event) {

    const listItem = event.target.closest('li');
    const productName = listItem.querySelector('span').textContent.trim();
    const index = productsArray.findIndex(product => product.productName === productName);
    if (index !== -1) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                listItem.remove();
                productsArray.splice(index, 1);
                itemCount.textContent = productsArray.length - countMarkedProducts();

                displayDeleteMessage();
            }
        });
    }
}

function editItem(event) {
    const listItem = event.target.closest('li');
    const productName = listItem.querySelector('span').textContent;
    const index = productsArray.findIndex(product => product.productName === productName);
    itemCount.textContent = productsArray.length - countMarkedProducts();


    Swal.fire({
        title: 'Edit to do',
        input: 'text',
        inputValue: productName,
        inputAttributes: {
            autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Update',
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value.trim() === '') {
                itemCount.textContent = productsArray.length - countMarkedProducts();

                Swal.fire({
                    title: `Input cannot be empty!`,
                    icon: 'warning'
                });
            } else {
                listItem.querySelector('span').textContent = result.value;

                productsArray[index].productName = result.value;

                Swal.fire({
                    title: `Updated successfully!`,
                });
            }
        }
    });
}



function countMarkedProducts() {
    productsArray = productsArray.filter(product => product.isMarked)
    return productsArray.length;
}

function displayDeleteMessage() {
    Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
    });
}


function clearAllItems() {
    while (addedList.firstChild) {
        addedList.removeChild(addedList.firstChild);
    }
    productsArray.length = 0;
    itemCount.textContent = ("no");
}




main();
