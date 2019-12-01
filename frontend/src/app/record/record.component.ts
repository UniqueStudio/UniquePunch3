import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.styl"]
})
export class RecordComponent implements OnInit {
  data;
  ids;
  constructor(private client: HttpClient) {
    this.data = { data: [] };
    this.initData().then(data => {
      console.log();
      this.data = data;
      this.ids = data.data.map(e => e.userid);
    });
  }

  async initData() {
    return (await this.fetch()) as { startTime; endTime; data: [{ userid }] };
  }
  fetch() {
    const url = "http://localhost:5000/punch";
    return this.client.get(url).toPromise();
  }

  ngOnInit() {}
}
