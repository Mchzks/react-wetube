import React, { useContext, useEffect, useState } from "react";
import Results from "./Results";
import axios from "axios";
import * as AppConstant from "./AppConstant";
import useDropdown from "./useDropdown";
import ColorContext from "./ColorContext";

const SearchArea = () => {

  const [keyword, setKeyword] = useState("");
  const [videos, setVideos] = useState([]);
  const orderList = ["date", "relevance", "rating", "title", "viewCount"];
  const [order, OrderDropdown] = useDropdown("Order By", "relevance", orderList);
  const [safeSearch, SafeSearchDropdown] = useDropdown("Safe Search", "none", ["moderate", "none", "strict"]);
  const [checked, setChecked] = useState(false);
  const [advanceParams, setAdvanceParams] = useState(``);
  const [themeColor, setThemeColor] = useContext(ColorContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(checked) {
      setAdvanceParams(`&order=${order}&safeSearch=${safeSearch}`)
    } else {
      setAdvanceParams(``)
    }
  }, [checked, order, safeSearch])

  async function requestSearch() {
    setLoading(true);
    axios
      .get(`${AppConstant.SEARCH_URL}&q=${keyword}${advanceParams}`).then((res) => {
        const { items } = res.data;
        console.log(items);
        setVideos(items || []);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    console.log("Video request submitted");
  }

  return (
    <div className="search-area">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestSearch();
        }}
      >
        <label htmlFor="keyword">
          Search
          <input
            id="keyword"
            value={keyword}
            placeholder="Search Keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
        <label htmlFor="advance">
          Advance Search
          <input type="checkbox" id="advanced" checked={checked} onChange={() => setChecked(!checked)} />
        </label>
        {
          checked ? 
          <div>
            <OrderDropdown />
            <SafeSearchDropdown />
            <label htmlFor="themeColor">
              Theme Color
              <select value={themeColor} onChange={(e) => setThemeColor(e.target.value)} onBlur={(e) => setThemeColor(e.target.value)}>
                <option value="#ad343e">Dark Red</option>
                <option value="darkblue">Dark Blue</option>
                <option value="darkgreen">Dark Green</option>
                <option value="aqua">Aqua</option>
              </select>
            </label>
          </div> : null
        }
        <button style={{ backgroundColor:themeColor }}>Submit</button>
      </form>
      <Results videos={videos} loading={loading} />
    </div>
  );
};

export default SearchArea;
