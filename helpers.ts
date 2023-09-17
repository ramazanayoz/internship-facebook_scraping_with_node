/*
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}



export function betweenRandomNum(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function click_puppeteer(page,element) {
    await page.evaluate(async (element) => {
        await eval(element).click();
        await page.waitForNavigation();
        //await page.goBack();
    }, page,element);
}


export async function getEvaluatedElement_puppeteer(documentSelector,page) {
    const button = await page.evaluateHandle((selector) => {
        document.querySelector(selector);
    },selector);
    console.log("clicked ++++ " + val);
}

export async function selector_click_puppeteer(handle ) {
    const val = await handle.evaluate(el=>{
        el.click();
    });
    console.log("clicked ++++ " + val);
}
/*
export async function getSelectorElements_Pup(selectorPath, page) {
    async function ss(selectorPath, page) {
        return await page.evaluate((selectorPath) => {
            //console.log("x+++++" + x);
            return document.querySelector(selectorPath);
        },selectorPath);
    }

    return new Promise(async function (resolve, reject) {
        let element =  await ss(selectorPath,page);
        let y ;
//        element.then(x => y = x);
        console.log(element);
        if(y){
            resolve();
        }else{
            reject();
        }
        console.log("BİTTİ");
    });
} */


/*
export async function pupClick(selector,page) {

    let buttonHandle = await page.$$(selector)[0];
    await buttonHandle.click();


 */
    /*
    let button = await page.evaluateHandle((selector) => {
        document.getElementsByTagName(selector)[0];
    },selector);


    await Promise.all([
        await button.evaluate(el=>{
            el.asElement().click();
        })
    ]);

}


     */


export async function timeout(ms:any) {
    await new Promise(resolve => setTimeout(resolve, ms));
}