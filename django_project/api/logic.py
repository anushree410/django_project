import json
from datetime import datetime

def make_date_count_response(calendar_str):
    # calendar_str = '{"1750032000": 9, "1750204800": 5, "1750550400": 7}'  # truncated for brevity
    print('inside date vs count')
    print(calendar_str)
    # Convert JSON string to dictionary
    calendar_data = json.loads(calendar_str)
    response=[]
    # Print readable dates and problem counts
    for ts_str, count in calendar_data.items():
        ts = int(ts_str)
        date = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d')
        print(f"{date}: {count} problems")
        response.append({
            "date": date,
            "count": count
        })
    print('end of  date vs count')
    return response

