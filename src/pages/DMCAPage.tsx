import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const DMCAPage = () => {
  return (
    <motion.div 
      className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">DMCA Policy</h1>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
              <p>
                Kelper respects the intellectual property rights of others and expects its users to do the same. 
                In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond 
                expeditiously to claims of copyright infringement that are reported to our designated 
                copyright agent.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. How to Submit a DMCA Takedown Notice</h2>
              <p>
                If you believe that content available on Kelper infringes your copyright, please send a 
                notification containing the following information to our designated copyright agent:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright that is allegedly infringed;</li>
                <li>Identification of the copyrighted work claimed to have been infringed;</li>
                <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to allow us to locate the material;</li>
                <li>Your contact information, including your address, telephone number, and email address;</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
                <li>A statement, under penalty of perjury, that the information in your notification is accurate and that you are authorized to act on behalf of the copyright owner.</li>
              </ul>
              <p className="mt-4">
                You can submit your DMCA notice to our designated copyright agent at:
              </p>
              <address className="not-italic mt-2">
                DMCA Agent: Ash<br />
                Kelper<br />
                Email: thekelperzone@gmail.com, Ashhhteroid@gmail.com
              </address>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Counter-Notification Procedures</h2>
              <p>
                If you believe that your content was removed (or to which access was disabled) is not infringing, 
                or that you have the authorization from the copyright owner, the copyright owner's agent, or 
                pursuant to the law, to upload and use the material, you may send a counter-notification 
                containing the following information to our copyright agent:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Your physical or electronic signature;</li>
                <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;</li>
                <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content;</li>
                <li>Your name, address, telephone number, and email address;</li>
                <li>A statement that you consent to the jurisdiction of the federal court in the district where you reside, or, if you reside outside of the United States, the Northern District of California; and</li>
                <li>A statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
              </ul>
              <p className="mt-4">
                If our copyright agent receives a counter-notification, we may send a copy of the counter-notification 
                to the original complaining party informing them that we may replace the removed content or cease 
                disabling it in 10 business days. Unless the copyright owner files an action seeking a court order 
                against the content provider, the removed content may be replaced or access to it restored in 10 to 
                14 business days after receipt of the counter-notification.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Repeat Infringer Policy</h2>
              <p>
                Kelper maintains a policy of terminating the accounts of users who are found to be repeat 
                infringers of copyrights. We consider a "repeat infringer" to be any user who has uploaded 
                or posted material for which we receive more than two DMCA takedown notices. We reserve the 
                right to terminate an account at any time, with or without notice, for any reason, including 
                for repeated copyright infringement.
              </p>
            </section>
            
            <section className="pb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Modifications to this Policy</h2>
              <p>
                Kelper reserves the right to modify this DMCA Policy at any time. We will notify users of any 
                material changes by posting the new DMCA Policy on this page. Your continued use of Kelper 
                after such changes constitutes your acceptance of the new DMCA Policy.
              </p>
              <p className="mt-4">
                If you have any questions about this DMCA Policy, please contact us at legal@kelper.com.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default DMCAPage;
