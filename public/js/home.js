$(document).ready(() =>{
    // alert('It worked');
    $.get("/api/posts", results => {
        // console.log('RESULTS',results);
        outputPosts(results, $('.postContainer'));
      });
})

function outputPosts(results, container){
    container.html('');
    // console.log('OutpoutPost', results);

    results.forEach(result => {
        // console.log(result);
        var html = createPosthtml(result);
        container.append(html);
    });
    if(results.length ==0){
        container.append(`<span class='noResult'>Nothing to show</span>`)
    }
}