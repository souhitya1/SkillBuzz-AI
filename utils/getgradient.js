function getGradient(title) {
    const gradients = [
        "linear-gradient(135deg, #6a5af9, #d66efd)",
        "linear-gradient(135deg, #f7971e, #ffd200)",
        "linear-gradient(135deg, #11998e, #38ef7d)",
        "linear-gradient(135deg, #ee0979, #ff6a00)",
        "linear-gradient(135deg, #2193b0, #6dd5ed)",
        "linear-gradient(135deg, #834d9b, #d04ed6)",
        "linear-gradient(135deg, #16a085, #f4d03f)"
    ];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash += title.charCodeAt(i);
    }
    return gradients[hash % gradients.length];
}

module.exports = getGradient;