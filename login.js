
export {loginToFacebook};

async function loginToFacebook(page){
    let loginError = false;
    //if(await login1(page)){
    //    return true;
    //}
    if(await login2(page)){
        return true
    }
    else{
        return false
    }
}

function getUserAndPass(){
    let faceUserArr=[];
    faceUserArr.push({email: "eayoz333@gmail.com", password: "rz123456"});
    return faceUserArr
}

async function login1(page){
    let inWhichUser = 0
    let usersPasswords= getUserAndPass()
    let existErr = false;
    await page.waitForSelector("input").then(async (x) => {
        await page.click("input[type=\"email\"]")
        await page.keyboard.type(usersPasswords[inWhichUser].email);
    }).catch(e => {
        //console.log(e)
        existErr =  false
    })

    await page.waitForSelector("input").then(async (x) => {
        await page.click("input[type=\"password\"]")
        await page.keyboard.type(usersPasswords[inWhichUser].password);
        await page.waitFor("input");
        await page.click("input[type=\"submit\"]");
    }).catch(e => {
        //console.log(e)
        existErr =  false
    })

    return existErr;
}

async function login2(page) {
    let usersPasswords= getUserAndPass()
    let inWhichUser = 0;
    let existErr;
    return await new Promise(async (resolve, reject) => {
        console.log("login2 ile giriş yapılıyor")
        console.log("login2 entry mail")

        await page.waitForSelector("input[type=\"text\"]").then( async x => {
            await page.click("input[type=\"text\"]")
            await page.keyboard.type(usersPasswords[inWhichUser].email);
        }).catch(e => {
            resolve(false);
        })
        console.log("login2 entry mail success")

        console.log("login2entry password")
        await page.waitForSelector("input[type=\"password\"]").then(async x => {
            await page.click("input[type=\"password\"]")
            await page.keyboard.type(usersPasswords[inWhichUser].password);
        }).catch(e=>{
            resolve(false);
        })

        console.log("login2 entry password success")

        console.log("login 2 submitting")
        try{
            await page.waitForSelector("button[type=\"submit\"]").then(async x => {
                await page.click("button[type=\"submit\"]");
            })
        }catch(e){
            resolve(false);
        }
        console.log("login 2 submit success")

        await page.waitForNavigation('15000','load')
        return await page.waitForSelector("div[role='main']", {timeout: 15000}).then( () => {
            console.log("login2 başarılı");
            resolve(true);
        }).catch( async (e) => {
            console.log("bir problem oluştu");
            await page.waitForSelector("form[ajaxify=\"/checkpoint/async?next\"]", {timeout: 3000}).then(x => {
                console.log("güvenlik sorunu çözülüyor");
                resolve(solveSecurityProblem());
            }).catch((e) => {
                console.log("solveSecurityProblem'de problem oluştu")
                resolve(false);
            })
        });
    });
}



/*
*
*
* */
