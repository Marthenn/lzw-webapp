let history = [];

const history_list = document.getElementById('history-list');

const make_history = (item) => {
    const {id, types, input, output, ratio, further} = item;
    const typeText = document.createElement('h3');
    typeText.innerText = types;
    const inputText = document.createElement('p');
    inputText.innerText = input;
    const outputText = document.createElement('p');
    outputText.innerText = output;
    const ratioText = document.createElement('p');
    ratioText.innerText = ratio;
    const furtherText = document.createElement('p');
    furtherText.innerText = further;

    const historyContainer = document.createElement('article');
    historyContainer.classList.add('history-item');

    historyContainer.append(typeText, inputText, outputText, ratioText, furtherText);
    return historyContainer;
}

const nuke_history = async () => {
    try{
        const response = await fetch('http://localhost:36656/history', {
            method: 'DELETE'
        });
        history = [];
    } catch (err) {
        throw err;
    }
}

const get_history = async () => {
    try{
        const response = await fetch('http://localhost:36656/history');
        history = await response.json();

        //clear history list
        history_list.innerHTML = '';

        for (const item of history){
            const history_item = make_history(item);
            history_list.append(history_item);
        }
    } catch (err) {
        throw err;
    }
}

const encode_fe = async (text) => {
    try{

    } catch (err) {
        throw err;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // load all history
    await get_history();

    const encode_button = document.getElementById('encode-button');
    encode_button.addEventListener('click', () => {
        // connect ke BE untuk encode
    })

    const delete_button = document.querySelector('.delete-button');
    delete_button.addEventListener('click', async () => {
        const status = prompt('Are you sure? (type "yes" to confirm)');
        if (status === 'yes'){
            try{
                console.log('nuking')
                await nuke_history();
                alert('History deleted!');
                console.log('bang udah bang')
                // clear the history list
                history_list.innerHTML = '';
            } catch (err) {
                console.log(err)
            }
        }
    })
})

document.addEventListener(RENDER_EVENT, () =>{
    const history_list = document.getElementById('history-list');
    history_list.innerHTML = "";
    for (const item of history){
        const history_item = make_history(item);
        history_list.append(history_item);
    }
})