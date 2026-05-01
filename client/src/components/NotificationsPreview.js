import React from 'react';

const SAMPLES = [
  {
    type: 'sms',
    sender: 'Rays · ShareMySeats',
    time: 'Tue 4:12 PM',
    body: '⚾ Yankees Friday is in 3 days — you have 2 open seats. Tap to assign before the price spike: rays.app/m/9k3',
  },
  {
    type: 'email',
    sender: 'ShareMySeats',
    time: 'Today, 8:14 AM',
    body: 'Diane Cowan accepted your ticket for Sunday — Twins at Rays. Her barcode is ready in Apple Wallet.',
  },
  {
    type: 'push',
    sender: 'Tampa Bay First Responders Foundation',
    time: 'Just now',
    body: '💙 Thank you! Officer Reyes & his daughter just sent a photo from your donated seats. Tap to view.',
  },
];

export default function NotificationsPreview() {
  return (
    <div className="notif-card">
      <div className="notif-head">
        <div>
          <div className="notif-eyebrow">Coming soon</div>
          <h3>Notifications keep you in the loop</h3>
        </div>
        <span className="notif-pill">Preview</span>
      </div>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {SAMPLES.map((s, i) => (
            <div key={i} className={`phone-msg phone-${s.type}`}>
              <div className="phone-msg-head">
                <span className="phone-sender">{s.sender}</span>
                <span className="phone-time">{s.time}</span>
              </div>
              <div className="phone-msg-body">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="notif-foot">
        Smart reminders before the price spike, recipient confirmations, and impact stories — all delivered to your phone.
      </div>
    </div>
  );
}
