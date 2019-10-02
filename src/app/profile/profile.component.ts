import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';

declare  var  google:  any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

  public data = [];
  private dataDisplay = [];
  public dataObj = {
    languages: {},
    mainLanguage: ""
  }
  private dataArr = [
    ['Programming Langauges', 'Per Repos']
  ]
  private dataShuffled : boolean = false;
  private google : any;
  public term_url: string;
  public user: any = {
  }
  public userNotFound: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute) { 
  
    this.google = google;

    let username = this.route.snapshot.params.username
    this.http.get('https://api.github.com/users/' + username).subscribe(res => {
      this.user = res
      if (this.user.company !== null) {
        this.user.company = this.user.company.replace(/[-!$%^&*()_+|~=`{}\[\]:";@'<>?,.\/]/g, '');
      }
      this.http.get('https://api.github.com/users/' + username + '/repos').subscribe((resp: any)=>{
        resp.forEach(item => {
          if (item.language !== null) {
            this.data.push({...item, viewMore: false})
          }
          if (item.language !== null) {
            if (Object.keys(this.dataObj.languages).length < 1) 
            {
              this.dataObj.mainLanguage = item.language;
              this.dataObj.languages[item.language] = 1;
            } 
            else if (this.dataObj.languages[item.language] === undefined) 
            {
              this.dataObj.languages[item.language] = 1;
            } 
            else 
            {
              this.dataObj.languages[item.language]++
              if (this.dataObj.languages[item.language] > this.dataObj.languages[this.dataObj.mainLanguage]) {
                this.dataObj.mainLanguage = item.language
              }
            }
          }
        });

        this.term_url = this.getTermUrl(this.dataObj.mainLanguage);

        Object.keys(this.dataObj.languages).map(key=> {
          this.dataArr.push([key, this.dataObj.languages[key]])
        })

        this.data = this.shuffleArr(this.data)

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart(this.dataArr));

      })
    }, error => {
      this.userNotFound = true
    })
    
  }

  ngOnInit() {

  }

  getTermUrl(language) {
    let term = language.toLowerCase();
    let baseUrl="https://www.computerhope.com/jargon/";
    let url = baseUrl + term.charAt(0) + '/' + term + '.htm'
    return url
  }

  httpGet(url){
    return new Promise(resolve => {
      this.http.get(url).subscribe(res => resolve(res))
    })
  }

  shuffleArr = (arr) => {
   let randomNum, tempVal, currentNum = arr.length;
    while(currentNum !== 0) {
      randomNum = Math.floor(Math.random() * currentNum)
      currentNum--;

      tempVal = arr[currentNum];
      arr[currentNum] = arr[randomNum] 
      arr[randomNum] = tempVal;
    }

    this.dataShuffled = true;
    
    return arr
  }

  viewMore = (i) => {
    this.data[i].viewMore = true;
    this.httpGet(this.data[i].languages_url)
      .then(result=> {
        this.data[i].languageBreakdown = result
        return this.httpGet("https://api.github.com/repos/" + this.data[i].full_name + '/commits')
      })
      .then((result:any)=> {
        this.data[i].commit_length = result.length
        this.data[i].dataLoaded = true;
      })
  }


  drawChart = (dataArr) => () => {
      var data = google.visualization.arrayToDataTable(dataArr);

      var options = {
        is3D: true,
      };

      if (document.getElementById('piechart') !== null) {
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      } else {
        setTimeout(()=>{
          return this.drawChart(dataArr)()
        }, 500)
      }
  }

  // getUserProfile() {
  //   this.http.get('https://api.github.com/users/' + this.profile).subscribe(resp=>{
  //     console.log(resp)
  //   })
  // }

}
