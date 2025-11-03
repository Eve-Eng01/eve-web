import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, Hand, Heart, Trash2, MoreVertical, Edit, Copy, EyeOff } from 'lucide-react';
import Modal from '../../../Accessories/MainModal';
import { DropdownInput, DropdownOption } from '../../../Accessories/DropdownInput';
import img from '../../../../assets/circle.png'
import DeleteConfirmationModal from '../../../Accessories/DeleteConfirmationModal';

// Ticket interface
export interface Ticket {
  id: string;
  ticketName: string;
  ticketPrice: string;
  purchaseLimit: string;
  ticketQuantity: DropdownOption;
  quantity: string;
  description: string;
  ticketType: string;
  ticketsSold: number;
}

// Dropdown Menu Component
const TicketOptionsDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onHide: () => void;
  position: { top: number; left: number };
}> = ({ isOpen, onClose, onEdit, onDuplicate, onHide, position }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-2xl shadow-lg border-2 border-purple-200 py-2 z-50 min-w-[200px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Edit className="w-5 h-5 text-gray-700" />
        <span className="text-gray-900 font-medium text-lg">Edit</span>
      </button>
      <button
        onClick={onDuplicate}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <Copy className="w-5 h-5 text-gray-700" />
        <span className="text-gray-900 font-medium text-lg">Duplicate</span>
      </button>
      <button
        onClick={onHide}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <EyeOff className="w-5 h-5 text-gray-700" />
        <span className="text-gray-900 font-medium text-lg">Hide Ticket</span>
      </button>
    </div>
  );
};

// Ticket Details Form Component
const TicketDetailsForm: React.FC<{ 
  ticketType: string; 
  onCancel: () => void;
  onSave: (ticket: Omit<Ticket, 'id' | 'ticketsSold'>) => void;
  editingTicket?: Ticket | null;
}> = ({ ticketType, onCancel, onSave, editingTicket }) => {
  // Define ticket quantity options
  const ticketQuantityOptions: DropdownOption[] = [
    { value: 'limited', label: 'Limited Quantity' },
    { value: 'unlimited', label: 'Unlimited Quantity' },
  ];

  const [formData, setFormData] = useState({
    ticketName: editingTicket?.ticketName || '',
    ticketPrice: editingTicket?.ticketPrice || '',
    purchaseLimit: editingTicket?.purchaseLimit || '',
    ticketQuantity: editingTicket?.ticketQuantity || ticketQuantityOptions[0],
    quantity: editingTicket?.quantity || '7500',
    description: editingTicket?.description || '',
  });

  const handleSave = () => {
    onSave({
      ...formData,
      ticketType,
    });
    onCancel();
  };

  const showPriceField = ticketType === 'paid';

  return (
    <div className="space-y-6">
      {/* Ticket Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket Name
        </label>
        <input
          type="text"
          value={formData.ticketName}
          onChange={(e) => setFormData({ ...formData, ticketName: e.target.value })}
          className="w-full text-gray-700 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
          placeholder="Enter ticket name"
        />
      </div>

      {/* Ticket Price - Only for Paid Ticket */}
      {showPriceField && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Ticket Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
            <input
              type="text"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
              className="w-full text-gray-700 pl-8 pr-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {/* Purchase Limit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purchase Limited
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
          <input
            type="text"
            value={formData.purchaseLimit}
            onChange={(e) => setFormData({ ...formData, purchaseLimit: e.target.value })}
            className="w-full text-gray-700 pl-8 pr-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Ticket Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <DropdownInput
            label="Ticket Quantity"
            options={ticketQuantityOptions}
            value={formData.ticketQuantity}
            onChange={(option: DropdownOption) => setFormData({ ...formData, ticketQuantity: option })}
            placeholder="Select ticket quantity"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Ticket Quantities
          </label>
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full text-gray-700 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket Description (this may include benefits)
        </label>
        <div className="relative">
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={1000}
            className="w-full text-gray-700 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors resize-none"
            placeholder="Enter description..."
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-500">
            {formData.description.length}/1000
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-[#7417C6] text-[#7417C6] rounded-lg hover:bg-purple-50 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-[#7417C6] text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Save Ticket
        </button>
      </div>
    </div>
  );
};

// Main Ticketing Component
interface TicketingProps {
    selectedTicketType: string;
    setSelectedTicketType: (type: string) => void;
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    onNext: () => void;
    onTicketsChange?: (tickets: Ticket[]) => void; // New prop to pass tickets to parent
  }
  
  const Ticketing: React.FC<TicketingProps> = ({
    selectedTicketType,
    setSelectedTicketType,
    isModalOpen,
    setIsModalOpen,
    onNext,
    onTicketsChange, // New prop
  }) => {
    const [savedTickets, setSavedTickets] = useState<Ticket[]>([]);
    const [showTicketTypes, setShowTicketTypes] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
    // Notify parent of ticket changes
    useEffect(() => {
      onTicketsChange?.(savedTickets);
    }, [savedTickets, onTicketsChange]);

  const ticketTypes = [
    {
      id: 'paid',
      label: 'Paid Ticket',
      icon: DollarSign,
      iconBgColor: 'bg-green-500',
      description: 'Charge attendees for tickets',
    },
    {
      id: 'free',
      label: 'Free Ticket',
      icon: Hand,
      iconBgColor: 'bg-blue-500',
      description: 'Allow free registration',
    },
    {
      id: 'donation',
      label: 'Donation',
      icon: Heart,
      iconBgColor: 'bg-pink-500',
      description: 'Accept donations from attendees',
    },
  ];

  const handleSaveTicket = (ticketData: Omit<Ticket, 'id' | 'ticketsSold'>) => {
    if (editingTicket) {
      setSavedTickets(savedTickets.map(ticket => 
        ticket.id === editingTicket.id 
          ? { ...ticketData, id: editingTicket.id, ticketsSold: editingTicket.ticketsSold }
          : ticket
      ));
      setEditingTicket(null);
    } else {
      const newTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
        ticketsSold: 0,
      };
      setSavedTickets([...savedTickets, newTicket]);
    }
    setShowTicketTypes(false);
    setIsModalOpen(false); // Close modal after saving
  };

  const handleDeleteClick = (id: string) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      setSavedTickets(savedTickets.filter(ticket => ticket.id !== ticketToDelete));
      setTicketToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const handleMoreClick = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 5,
      left: rect.left - 150,
    });
    setDropdownOpen(dropdownOpen === ticketId ? null : ticketId);
  };

  const handleEdit = (ticketId: string) => {
    const ticket = savedTickets.find(t => t.id === ticketId);
    if (ticket) {
      setEditingTicket(ticket);
      setSelectedTicketType(ticket.ticketType);
      setIsModalOpen(true);
      setDropdownOpen(null);
    }
  };

  const handleDuplicate = (ticketId: string) => {
    const ticket = savedTickets.find(t => t.id === ticketId);
    if (ticket) {
      const duplicatedTicket: Ticket = {
        ...ticket,
        id: Date.now().toString(),
        ticketName: `${ticket.ticketName} (Copy)`,
      };
      setSavedTickets([...savedTickets, duplicatedTicket]);
      setDropdownOpen(null);
    }
  };

  const handleHide = (ticketId: string) => {
    console.log('Hide ticket:', ticketId);
    setDropdownOpen(null);
    // Implement hide logic here
  };

  const handleAddTicket = () => {
    setEditingTicket(null);
    setShowTicketTypes(true);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6">
      <div className="mx-auto bg-white">
        {/* Show ticket types selection or saved tickets */}
        {showTicketTypes && savedTickets.length === 0 ? (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mb-6">Enter Ticket Types</h3>

            <div className="space-y-4 mb-8">
              {ticketTypes.map((ticket) => {
                const Icon = ticket.icon;
                const isSelected = selectedTicketType === ticket.id;

                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketType(ticket.id)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all cursor-pointer ${
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

            {selectedTicketType === 'donation' && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Donation ticket details coming soon
              </p>
            )}
          </>
        ) : (
          <>
            {/* Saved Tickets Display */}
            {savedTickets.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="px-6 py-3 bg-white border-2 border-purple-300 rounded-full">
                    <span className="text-gray-700 font-semibold">
                      {savedTickets.length} Ticket{savedTickets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full">
                    <span className="text-gray-700 font-semibold">10 January 2025</span>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Ticket Name</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Ticket Price</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Quantity</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Ticket Sold</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Table Rows */}
                  {savedTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-5 items-center ${
                        index !== savedTickets.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="col-span-3">
                        <span className="text-gray-800 font-medium">{ticket.ticketName}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-800 font-medium">
                          ${parseFloat(ticket.ticketPrice || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-800 font-medium">{ticket.quantity}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-800 font-medium">
                          {ticket.ticketsSold}/{ticket.quantity}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteClick(ticket.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                        <button 
                          onClick={(e) => handleMoreClick(e, ticket.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Ticket Button */}
            <button
              onClick={handleAddTicket}
              className="w-full py-4 border-2 border-[#7417C6] text-[#7417C6] rounded-2xl hover:bg-purple-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              Add Ticket
              <span className="text-2xl">+</span>
            </button>
          </>
        )}
      </div>

      {/* Ticket Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
          if (savedTickets.length > 0) {
            setShowTicketTypes(false);
          }
        }}
        title={editingTicket ? "Edit Ticket Details" : "Add New Ticket Details"}
        size="lg"
        animationDuration={300}
      >
        <TicketDetailsForm
          ticketType={selectedTicketType}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTicket(null);
            if (savedTickets.length > 0) {
              setShowTicketTypes(false);
            }
          }}
          onSave={handleSaveTicket}
          editingTicket={editingTicket}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title='Delete This Ticket'
        description= {<p className="text-gray-600 mb-8 px-4 leading-relaxed">If you delete this ticket, it will be permanently removed from your event. All information attached to it including ticket name, price, availability, attendee registrations, and any related settings will also be deleted. This action cannot be undone.</p>}
      />

      {/* Dropdown Menu */}
      <TicketOptionsDropdown
        isOpen={dropdownOpen !== null}
        onClose={() => setDropdownOpen(null)}
        onEdit={() => dropdownOpen && handleEdit(dropdownOpen)}
        onDuplicate={() => dropdownOpen && handleDuplicate(dropdownOpen)}
        onHide={() => dropdownOpen && handleHide(dropdownOpen)}
        position={dropdownPosition}
      />
    </div>
  );
};

export default Ticketing;