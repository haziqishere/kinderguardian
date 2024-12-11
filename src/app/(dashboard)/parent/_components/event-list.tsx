import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EventList = () => {
  const events = [
    {
      title: 'Petrosains KLCC Visit',
      date: '30 March 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      title: "Beryl's Chocolate Factory Visit",
      date: '8 August 2024',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="space-y-2 rounded-xl p-3 shadow-xs border outline-0">
              <h3 className="text-blue-600 font-medium hover:underline cursor-pointer">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;