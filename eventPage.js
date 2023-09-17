
export {getEvents};

async function getEvents(page){
    console.log("opening event page");
    await page.goto('https://www.facebook.com/events/discovery/?suggestion_token={"city":"106012156106461"}&acontext={"ref":2,"ref_dashboard_filter":"upcoming","source":2,"source_dashboard_filter":"discovery","action_history":"[{\"surface\":\"dashboard\",\"mechanism\":\"main_list\",\"extra_data\":{\"dashboard_filter\":\"upcoming\"}},{\"surface\":\"discover_filter_list\",\"mechanism\":\"surface\",\"extra_data\":{\"dashboard_filter\":\"discovery\"}}]","has_source":true}');

    console.log("asd");
    await page.content();
    console.log("aa")
    console.log("adsx")
    let source = await page.content({"waitUntil": "domcontentloaded"});

    //console.log(source)

    debugger
    console.log("asdxqqq")
    console.log("xxx")
    return true;
}