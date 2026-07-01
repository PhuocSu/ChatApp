export const updateConversationAfterCreateMessage = async (conversation, message, senderId) => {
    conversation.set({
        // Reset lại trạng thái đã xem
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId: senderId,
            createdAt: message.createdAt
        }
    })

    // Cập nhật số tin nhắn cho người đọc về 0, còn tin nhắn của người nhận thêm 1 mỗi khi có tin nhắn mới
    conversation.participants.forEach((p) => {
        // Tỏng mongoose, thường là ObjectID nên chuyển thành string để dễ so sánh, tạo key cho Map
        const memberId = p.userId.toString()
        const isSender = memberId === senderId.toString()
        const prevCount = conversation.unreadCounts.get(memberId) || 0
        conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1)
    })
}

export const emitNewMessage = (io, conversation, message) => {
  io.to(conversation._id.toString()).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: conversation.unreadCounts,
  });
};