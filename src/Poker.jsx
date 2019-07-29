import React from "react"
export default class Poker extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div>
				<div className="card suithearts">
				  <div className="front">
				    <div className="spotTop">10</div>
				    <div className="card_content">
						<div className="spotA1"></div>
					    <div className="spotA2"></div>
					    <div className="spotA4"></div>
					    <div className="spotA5"></div>
					    <div className="spotB2"></div>
					    <div className="spotB4"></div>
					    <div className="spotC1"></div>
					    <div className="spotC2"></div>
					    <div className="spotC4"></div>
					    <div className="spotC5"></div>
				    </div>	
				    <div className="spotBottom">10</div>		    
				  </div>
				</div>
			</div>
			);
	}
}