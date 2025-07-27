import json
from datetime import datetime

def make_date_count_response(calendar_str):
    calendar_data = json.loads(calendar_str)
    response=[]
    for ts_str, count in calendar_data.items():
        ts = int(ts_str)
        date = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d')
        response.append({
            "date": date,
            "count": count
        })
    return response

