# 🏠 RealEstate AI

**AI-Driven Deal Ranking and Analysis for Real Estate Investors**

RealEstate AI is a comprehensive platform that leverages artificial intelligence to help real estate investors discover, analyze, and rank investment opportunities. Built with Next.js 14, TypeScript, and modern AI technologies.

![RealEstate AI](https://img.shields.io/badge/Next.js-14.2.31-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FF6B35?style=for-the-badge)

## ✨ Features

### 🔐 **Authentication & Security**
- **Firebase Integration**: Secure user authentication and data management
- **Protected Routes**: Navigation and features only visible to authenticated users
- **User Profiles**: Personalized dashboard and settings

### 🏘️ **Property Management**
- **AI-Powered Scraper**: Intelligent property discovery from multiple sources
- **Property Analytics**: Comprehensive data analysis and insights
- **Map Integration**: Interactive Google Maps visualization of properties

### 🤖 **AI Assistant**
- **Investment Analysis**: AI-powered deal ranking and scoring
- **Market Insights**: Predictive analytics and market trends
- **Report Generation**: Automated investment reports and recommendations

### 📊 **Dashboard & Analytics**
- **Real-time Data**: Live market data and property updates
- **Investment Tracking**: Portfolio management and performance metrics
- **Market Reports**: Comprehensive market analysis and trends

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first, responsive interface
- **Dark/Light Mode**: Theme switching with system preference detection
- **Modern Components**: Built with Radix UI and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account for authentication
- Google Maps API key (for map features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uttamofficial/RealEstate-AI.git
   cd RealEstate-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Authentication
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   
   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # AI Services (if applicable)
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── ai-assistant/      # AI chat interface
│   ├── dashboard/         # Main dashboard
│   ├── properties/        # Property management
│   ├── analytics/         # Analytics and reports
│   ├── scraper/          # Property scraper
│   ├── map/              # Map visualization
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── theme/            # Theme components
├── ai/                   # AI flows and logic
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library

### **Authentication**
- **Clerk**: Complete authentication solution
- **Protected Routes**: Role-based access control

### **AI & Analytics**
- **Google AI**: Generative AI capabilities
- **Custom AI Flows**: Deal ranking and analysis
- **Real-time Data**: Live market insights

### **Maps & Visualization**
- **Google Maps**: Interactive property mapping
- **Recharts**: Data visualization components

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Additional commands
npm run type-check   # TypeScript type checking
```

## 📱 Features in Detail

### **Authentication System**
- Secure user registration and login
- Protected navigation and features
- User profile management
- Session handling

### **Property Scraper**
- AI-powered property discovery
- Multiple data source integration
- Intelligent filtering and sorting
- Export capabilities

### **AI Assistant**
- Natural language queries
- Investment recommendations
- Market analysis
- Report generation

### **Map Integration**
- Interactive property mapping
- Location-based search
- Property clustering
- Route optimization

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- **Issues**: [GitHub Issues](https://github.com/uttamofficial/RealEstate-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/uttamofficial/RealEstate-AI/discussions)
- **Email**: [Your Email]

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Clerk** for authentication solutions
- **Tailwind CSS** for the utility-first CSS approach
- **Open Source Community** for inspiration and tools

---

**Built with ❤️ for Real Estate Investors**

*Transform your real estate investment strategy with AI-powered insights and analysis.*
