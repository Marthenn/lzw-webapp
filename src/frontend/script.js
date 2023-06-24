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
        alert(err);
    }
}

const get_history = async () => {
    try{
        const response = await fetch('http://localhost:36656/history');
        history = await response.json();

        //clear history list
        history_list.innerHTML = '';

        history = history.reverse();

        for (const item of history){
            const history_item = make_history(item);
            history_list.append(history_item);
        }
    } catch (err) {
        alert (err);
    }
}

const encode_fe = async (text, further) => {
    try{
        const further_body = further ? 'yes' : 'no';
        const response = await fetch('http://localhost:36656/encode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                further: further_body,
                input: text
            })
        });

        const data = await response.json();

        const new_history = make_history(data);
        history_list.prepend(new_history);
    } catch (err) {
        alert(err)
    }
}

const decode_fe = async (text, further) => {
    try{
        const further_body = further ? 'yes' : 'no';
        const response = await fetch('http://localhost:36656/decode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                further: further_body,
                input: text
            })
        });

        console.log(response)

        const data = await response.json();

        const new_history = make_history(data);
        history_list.prepend(new_history);
    } catch (err) {
        alert(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // load all history
    await get_history();

    const encode_button = document.getElementById('encode-button');
    encode_button.addEventListener('click', () => {
        const further_switch = document.getElementById('further-switch');
        const further = further_switch.querySelector('input').checked;
        
        const decode_switch = document.getElementById('decode-switch');
        const decode_status = decode_switch.querySelector('input').checked;
        
        const input = document.getElementById('raw-text').value;

        if (input === ''){
            alert('Please input some text!');
            return;
        }

        if(decode_status){
            decode_fe(input, further);
        } else {
            encode_fe(input, further);
        }
    })

    const delete_button = document.querySelector('.delete-button');
    delete_button.addEventListener('click', async () => {
        const status = prompt('Are you sure? (type "yes" to confirm)');
        if (status === 'yes'){
            try{
                await nuke_history();
                alert('History deleted!');
                // clear the history list
                history_list.innerHTML = '';
            } catch (err) {
                console.log(err);
            }
        }
    })
})
