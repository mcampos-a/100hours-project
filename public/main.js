//This is where you put the code that reaches out to the server to send information back and forth


//Info can travel back and forth using the fetch() method
const deleteWellText = document.querySelector('.fa-trash')

Array.from(deleteWellText).forEach((element) =>{
    element.addEventListener('click', deleteWell)
})

async function deleteWell(){
    const well = this.parentNode.childNodes[1].innerText
    // const wellYear = this.parentNode.childNodes[3].innerText
    try{
        const response = await fetch('deleteWell', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'wellNameFromJS': well
                // 'constructionDateS': wellYear
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
    
}