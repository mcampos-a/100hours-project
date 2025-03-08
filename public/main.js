//This is where you put the code that reaches out to the server to send information back and forth


//Info can travel back and forth using the fetch() method
const deleteWellText = document.querySelectorAll('.deleteWells')
const waterLevel = document.querySelectorAll('.correctedWaterLevel')


Array.from(deleteWellText).forEach((element) =>{
    element.addEventListener('click', deleteWell)
})

Array.from(waterLevel).forEach((element)=>{
    element.addEventListener('click', calculateWaterLevel)
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

async function calculateWaterLevel(){
    const well = this.parentNode.childNodes[1].innerText
    const staticWL = Number(this.parentNode.childNodes[5].innerText)
    const correction = Number(this.parentNode.childNodes[7].innerText)
    const cSWL = Number(this.parentNode.childNodes[9].innerText)
    try{
        const response = await fetch('calculateWaterLevel', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'wellNameFromJS': well,
              'staticSWLFromJS': staticWL,
              'correctionFromJS': correction,
              'correctedSWLFromJS': cSWL
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}