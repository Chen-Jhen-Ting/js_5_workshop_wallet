window.addEventListener('DOMContentLoaded',function(){
    let itemFormBtn = document.querySelector('#item-form button')
    let searchFormBtn = document.querySelector('#search-form button')

    // 新增資料並存放於localstorage
    itemFormBtn.addEventListener('click',function(event){
        event.preventDefault();
        let form = document.querySelector('#item-form')
        let category = document.querySelector('#item-form [name="category"]')
        let date = document.querySelector('#item-form [name="date"]')
        let amount = document.querySelector('#item-form [name="amount"]')
        let description = document.querySelector('#item-form [name="description"]')
        let totalRecords =   JSON.parse(localStorage.getItem('record')) || [] 
        console.log(totalRecords)
        
        let record = {
            uuid: `${generateUUID()}`,
            category: `${category.value}`,
            date: `${date.value}`,
            amount:`${amount.value}`,
            description: `${description.value}`
        }

        // 判斷是否填好表單
        if (record.category != "" && record.date != "" && record.amount != "") {
            totalRecords.push(record) //把新增的資料加入紀錄
            localStorage.setItem('record',JSON.stringify(totalRecords))
            showRecord(totalRecords) //資料更新後要顯示在看板上
            form.reset()

        }else{
            alert('要填好喔')
        }
    })

    // 刪除功能
    document.querySelector('table').addEventListener('click',function(e){
        if(e.target.textContent === "x"){
            console.log(e.target.textContent)
            let totalRecords =   JSON.parse(localStorage.getItem('record'))
            let target_uuid = e.target.dataset["uuid"]
            let removeTarget = totalRecords.find(function(x){ return x.uuid === target_uuid })
            let removeSite = totalRecords.indexOf(removeTarget)
            console.log(removeTarget)
            if (removeSite != -1){
                totalRecords.splice(removeSite,removeSite+1)
                localStorage.setItem('record',JSON.stringify(totalRecords))
                showRecord()
            }
        }
    })

    searchFormBtn.addEventListener('click',function(e){
        e.preventDefault();
        let month = document.querySelector('[name="month"]').value
        let category = document.querySelector('[name="category"]').value
        let totalRecords =   JSON.parse(localStorage.getItem('record'))
        // console.log(totalRecords)
        if(category != ""){
            totalRecords = totalRecords.filter( x => x.category === `${category}` )
        }
        if(month != ""){
            totalRecords = totalRecords.filter( x => x.date.match(new RegExp(`${month.replace('-','\\-')}`, 'gm') ))
        }
        totalRecords.sort(datesort)
        showRecord(totalRecords)
        // console.log(totalRecords)
    })



    //資料呈現
    function showRecord ( input ){
        console.log(input)
        let tbody = document.querySelector('#records-panel')
        let totalRecords = input || (JSON.parse(localStorage.getItem('record')) || [] ).sort(datesort) 
        // 移除tbody內所有物件，這樣後來新增的物件就不會重複顯示
        while(tbody.firstChild){
            tbody.removeChild((tbody.firstChild))
        }
        
        for( let i = 0 ; i < totalRecords.length ; i++ ){
            let tr = document.createElement('tr')
            let td_category = document.createElement('td')
            let td_date = document.createElement('td')
            let td_amount = document.createElement('td')
            let td_description = document.createElement('td')
            let span = document.createElement('span')
            span.textContent = 'x'
            span.classList.add('remove')
            span.setAttribute('data-uuid',`${totalRecords[i].uuid}`)
            let td_x = document.createElement('td')
            td_x.appendChild(span)
            
            td_category.textContent = totalRecords[i].category
            td_date.textContent = totalRecords[i].date
            td_amount.textContent = totalRecords[i].amount
            td_description.textContent = totalRecords[i].description

            tr.appendChild(td_date)
            tr.appendChild(td_category)
            tr.appendChild(td_description)
            tr.appendChild(td_amount)
            tr.appendChild(td_x)
            tbody.appendChild(tr)
        }  
    }
    //時間排序
    function datesort (x,y){ 
        if ( Date.parse(x.date) > Date.parse(y.date) ){
            return -1
        } else{
            return 1
        }
    }
    //亂碼產生
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d+ Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };
    showRecord()
})