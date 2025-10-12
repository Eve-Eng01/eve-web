import  { useState } from 'react';
import { DollarSign, Hand, Heart } from 'lucide-react';
import img from '../../../../assets/circle.png'

const Ticketing = () => {
  const [selectedTicketType, setSelectedTicketType] = useState('paid');

  const ticketTypes = [
    {
      id: 'paid',
      label: 'Paid Ticket',
      icon: DollarSign,
      iconBgColor: 'bg-green-500',
      description: 'Charge attendees for tickets'
    },
    {
      id: 'free',
      label: 'Free Ticket',
      icon: Hand,
      iconBgColor: 'bg-blue-500',
      description: 'Allow free registration'
    },
    {
      id: 'donation',
      label: 'Donation',
      icon: Heart,
      iconBgColor: 'bg-pink-500',
      description: 'Accept donations from attendees'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Enter Ticket Types</h2>
      
      <div className="space-y-4">
        {ticketTypes.map((ticket) => {
          const Icon = ticket.icon;
          const isSelected = selectedTicketType === ticket.id;
          
          return (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicketType(ticket.id)}
              className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-purple-50 border-2 border-purple-400'
                  : 'bg-white border-2 border-dashed border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${ticket.iconBgColor} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-800">
                  {ticket.label}
                </span>
              </div>
              
              {isSelected && (
                <img src={img} alt="" className='w-[32px] h-[32px]'/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Ticketing;