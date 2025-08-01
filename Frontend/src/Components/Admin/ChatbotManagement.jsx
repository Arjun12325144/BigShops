import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiUsers, FiBarChart, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';
import { BiBot, BiUser } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'sonner';

const ChatbotManagement = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    resolvedConversations: 0,
    categories: {}
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Fetch conversations
  const fetchConversations = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category })
      });

      const response = await axios.get(`${API_BASE_URL}/chatbot/admin/conversations?${params}`);
      
      if (response.data.success) {
        setConversations(response.data.conversations);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = () => {
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(conv => conv.status === 'active').length;
    const resolvedConversations = conversations.filter(conv => conv.status === 'resolved').length;
    
    const categories = conversations.reduce((acc, conv) => {
      acc[conv.category] = (acc[conv.category] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalConversations,
      activeConversations,
      resolvedConversations,
      categories
    });
  };

  useEffect(() => {
    fetchConversations();
  }, [filters.status, filters.category]);

  useEffect(() => {
    calculateStats();
  }, [conversations]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      resolved: 'bg-blue-100 text-blue-800',
      escalated: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Get category badge style
  const getCategoryBadge = (category) => {
    const styles = {
      order_inquiry: 'bg-purple-100 text-purple-800',
      product_info: 'bg-yellow-100 text-yellow-800',
      shipping: 'bg-indigo-100 text-indigo-800',
      returns: 'bg-orange-100 text-orange-800',
      account: 'bg-pink-100 text-pink-800',
      payment: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return styles[category] || 'bg-gray-100 text-gray-800';
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      conv.sessionId.toLowerCase().includes(searchLower) ||
      conv.userId?.name?.toLowerCase().includes(searchLower) ||
      conv.userId?.email?.toLowerCase().includes(searchLower) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot Management</h1>
          <p className="text-gray-600">Monitor and manage customer support conversations</p>
        </div>
        <button
          onClick={() => fetchConversations(pagination.currentPage)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiMessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              <p className="text-gray-600">Total Conversations</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.activeConversations}</p>
              <p className="text-gray-600">Active Chats</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBarChart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedConversations}</p>
              <p className="text-gray-600">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BiBot className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-gray-600">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FiSearch className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="order_inquiry">Order Inquiry</option>
            <option value="product_info">Product Info</option>
            <option value="shipping">Shipping</option>
            <option value="returns">Returns</option>
            <option value="account">Account</option>
            <option value="payment">Payment</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Conversations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {conversation.userId?.name || 'Anonymous User'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(conversation.status)}`}>
                          {conversation.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadge(conversation.category)}`}>
                          {conversation.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.messages[conversation.messages.length - 1]?.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{conversation.messages.length} messages</span>
                        <span>{formatDate(conversation.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => fetchConversations(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchConversations(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Conversation Details */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Conversation Details</h2>
          </div>
          {selectedConversation ? (
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {selectedConversation.messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <BiUser className="w-4 h-4" />
                      ) : (
                        <BiBot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotManagement;