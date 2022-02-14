function chooseThis(pilih){
    const pilihan=pilih.id
    pilih.classList.toggle('suit')
    const game = new PlayGame(pilihan)
    let hasil=console.log(game.play())
    return hasil
}
function reloadPage(){
    return location.reload()
}
class PlayGame{
    constructor(pilihan1){
        this.pilihanPlayer=pilihan1
        let randomChoose=Math.floor((Math.random()*3)+1)
        if (randomChoose === 1){
            this.pilihanCom="batu"
            let computer=document.getElementById(this.pilihanCom+"2")
            computer.classList.toggle('suit')
        }else if (randomChoose === 2){
            this.pilihanCom="kertas"
            let computer=document.getElementById(this.pilihanCom+"2")
            computer.classList.toggle('suit')
        }else{
            this.pilihanCom="gunting"
            let computer=document.getElementById(this.pilihanCom+"2")
            computer.classList.toggle('suit')
        }
        
    }
    play(){
        let bothChoice=this.pilihanPlayer+this.pilihanCom
        const element =document.getElementById("middle")
        switch (bothChoice){
            case "guntingkertas":
                element.innerText='You win';
                element.classList.toggle('result');
                
                break;
            case "guntingbatu":
                element.innerText="You lose"
                element.classList.toggle('result');
                break;
            case "guntinggunting":
                element.innerText="Draw"
                element.classList.toggle('result');
                
                break;
            case "kertaskertas":
                element.innerText="Draw"
                element.classList.toggle('result');
                
                break;
            case "kertasgunting":
                element.innerText="You lose"
                element.classList.toggle('result');
                
                break;
            case "kertasbatu":
                element.innerText='You win'
                element.classList.toggle('result');
                
                break;
            case "batugunting":
                element.innerText='You win'
                element.classList.toggle('result');
                
                break;
            case "batukertas":
                element.innerText="You lose"
                element.classList.toggle('result');
                
                break;
            case "batubatu":
                element.innerText="Draw"
                element.classList.toggle('result');
                
                break;
        }
        element.style.color="white"
        element.style.fontSize="250%"
    }
}
