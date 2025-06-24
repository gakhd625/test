
// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { AlertCircle, ExternalLink } from 'lucide-react';

// interface TokenInputProps {
//   onTokenSubmit: (token: string) => void;
// }

// const TokenInput = ({ onTokenSubmit }: TokenInputProps) => {
//   const [token, setToken] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (token.trim()) {
//       onTokenSubmit(token.trim());
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
//         <div className="text-center mb-6">
//           <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
//             <AlertCircle className="w-6 h-6 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapbox Token Required</h2>
//           <p className="text-gray-600">
//             To display the map, please enter your Mapbox public token below.
//           </p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="token">Mapbox Public Token</Label>
//             <Input
//               id="token"
//               type="text"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//               placeholder="pk.eyJ1..."
//               className="mt-1"
//               required
//             />
//           </div>
          
//           <Button 
//             type="submit" 
//             className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
//           >
//             Continue to App
//           </Button>
//         </form>
        
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700 mb-2">
//             <strong>Don't have a token?</strong>
//           </p>
//           <p className="text-sm text-blue-600 mb-3">
//             Get your free Mapbox public token from the Mapbox dashboard.
//           </p>
//           <a
//             href="https://account.mapbox.com/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
//           >
//             Get Token <ExternalLink className="w-3 h-3" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TokenInput;
