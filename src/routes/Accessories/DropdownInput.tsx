import { ArrowDown2 } from "iconsax-reactjs";
import { Check, Plus } from "lucide-react";
import React, { useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownInputProps {
  label?: string;
  options: DropdownOption[];
  value: DropdownOption | null;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
  searchable?: boolean;
  addNewOption?: boolean;
  onAddNew?: (newOption: DropdownOption) => void;
  className?: string;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  addNewOption = false,
  onAddNew,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newOptionText, setNewOptionText] = useState<string>("");
  const [showAddInput, setShowAddInput] = useState<boolean>(false);

  const filteredOptions: DropdownOption[] = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleOptionSelect = (option: DropdownOption): void => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleAddNew = (): void => {
    if (newOptionText.trim()) {
      const newOption: DropdownOption = { value: newOptionText, label: newOptionText };
      onAddNew && onAddNew(newOption);
      setNewOptionText("");
      setShowAddInput(false);
      handleOptionSelect(newOption);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleAddNew();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && <label className="block text-gray-600 text-sm mb-2 font-medium">{label}</label>}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-left text-gray-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all flex justify-between items-center"
        >
          <span className={value ? "text-gray-800" : "text-gray-500"}>{value ? value.label : placeholder}</span>
          <ArrowDown2
            color="#000"
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            variant="Outline"
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchable && (
              <div className="p-3 border-b">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-black w-full px-3 py-2 bg-gray-100 rounded border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="text-gray-800">{option.label}</span>
                  {value?.value === option.value && <Check className="w-5 h-5 text-purple-600" />}
                </button>
              ))}

              {addNewOption && !showAddInput && (
                <button
                  type="button"
                  onClick={() => setShowAddInput(true)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new option
                </button>
              )}

              {addNewOption && showAddInput && (
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new business type"
                      value={newOptionText}
                      onChange={(e) => setNewOptionText(e.target.value)}
                      className="text-black flex-1 px-3 py-2 bg-gray-100 rounded border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {filteredOptions.length === 0 && !addNewOption && (
                <div className="px-4 py-3 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
