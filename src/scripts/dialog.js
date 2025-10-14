
// const dialog = {

//     element(element){
//         const dialog = document.querySelector(element)
//         return dialog
//     },
//     onShow(element){
//         const dialog = this.element(element);
//         dialog.showModal();
//     },
//     onClose(element){
//         const dialog = this.element(element);
//         dialog.showModal();
//     }

// }

class Dialog {

    constructor(element){
        this.element = document.querySelector(element);
        const element_childrens = Array.from(this.element.children);

        if(this.element){
            this.header = element_childrens
            .find((dialog_item)=>dialog_item.className == "header-container");

            this.content = element_childrens
            .find((dialog_item)=>dialog_item.className == "dialog-content-container")
            .children[0]
        }

        }
        
    onShowModal(){
        this.element.showModal()
    }
    onCloseModal(){
        this.element.close()
    }

}

export {
    Dialog
}