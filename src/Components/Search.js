
import SearchYT from '../searchRequest.js'

function  Search ({handleClick}){ 
    // console.log({handleClick});
    return(
        <div className="row p-5 justify-content-md-center">
            <div className="col-md-4">
                <div className="input-group mb-3">
                    <input id="searchInput" className="form-control" type="text" 
                        onKeyDown={event => {
                            if(event.key ==='Enter'){
                                SearchYT({handleClick})
                            }
                        }}

                    />
                    <button className="btn btn-danger"  onClick={event => 
                        SearchYT({handleClick})
                        //handleClick(document.getElementById("searchInput").value)
                    } >Search</button>
                </div>
                
            </div>

        </div>
    )
}

export default Search;