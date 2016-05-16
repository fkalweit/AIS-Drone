package balanceboard;

import java.io.IOException;

import java.io.PrintWriter;
import java.net.Socket;

import wiiremotej.BalanceBoard;
import wiiremotej.MassConstants;
import wiiremotej.WiiRemote;
import wiiremotej.WiiRemoteJ;
import wiiremotej.event.BBButtonEvent;
import wiiremotej.event.BBCombinedEvent;
import wiiremotej.event.BBMassEvent;
import wiiremotej.event.BBStatusEvent;
import wiiremotej.event.BalanceBoardListener;
import wiiremotej.event.WiiRemoteAdapter;

import com.intel.bluetooth.BlueCoveConfigProperties;

public class BalanceBoardTest extends WiiRemoteAdapter implements
		BalanceBoardListener {
	private WiiRemote _remote;
	private BalanceBoard _balance;
	private Socket echoSocket;
	private PrintWriter out;

	private static int pressedCounter = 0;

	public static void main(String... args) {

		// Nur für Windows relevant
		// System.setProperty(BlueCoveConfigProperties.PROPERTY_STACK_FIRST,
		// "widcomm");
		// System.setProperty(BlueCoveConfigProperties.PROPERTY_STACK,
		// "widcomm");
		// System.out.println("Stack:" +
		// LocalDevice.getProperty("bluecove.stack"));

		System.setProperty(
				BlueCoveConfigProperties.PROPERTY_JSR_82_PSM_MINIMUM_OFF,
				"true");

		BalanceBoardTest wii = new BalanceBoardTest();
		try {
			wii.init();
		} catch (IllegalStateException | InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void init() throws IllegalStateException, InterruptedException,
			IOException {

		System.out.println("Suche Balance board");

		_balance = WiiRemoteJ.findBalanceBoard();

		if (_balance != null) {
			System.out.println("Balance board gefunden");

			// _balance.setLEDIlluminated(true);

			echoSocket = new Socket("127.0.0.1", 6112);
			out = new PrintWriter(echoSocket.getOutputStream(), true);

			_balance.addBalanceBoardListener(this);

			final BalanceBoard boardF = _balance;
			Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
				public void run() {
					boardF.disconnect();
					out.close();
					try {
						echoSocket.close();
					} catch (IOException ex) {
						ex.printStackTrace();
					}
				}
			}));

		}

		System.in.read();

	}

	/**
	 * ACHTUNG: Feuert konstant
	 */
	@Override
	public void buttonInputReceived(BBButtonEvent evt) {
		// TODO Auto-generated method stub

		if (evt.isPressed()) {
			// out.print("pressed");
			// out.flush();
			// System.out.println(pressedCounter++);

		}
	}

	@Override
	public void combinedInputReceived(BBCombinedEvent evt) {
		// TODO Auto-generated method stub

	}

	@Override
	public synchronized void massInputReceived(BBMassEvent evt) {

		// System.out.println("Total mass" + evt.getTotalMass());

		double massX, massY;

		double massTL = evt.getMass(MassConstants.TOP, MassConstants.LEFT);
		double massTR = evt.getMass(MassConstants.TOP, MassConstants.RIGHT);
		double massBL = evt.getMass(MassConstants.BOTTOM, MassConstants.LEFT);
		double massBR = evt.getMass(MassConstants.BOTTOM, MassConstants.RIGHT);

		if (evt.getTotalMass() > 3) { // if mass is too small, don't bother
			double topMass = massTL + massTR;
			double bottomMass = massBL + massBR;
			double leftMass = massTL + massBL;
			double rightMass = massTR + massBR;

			double vertRange = topMass + bottomMass;
			double horizRange = rightMass + leftMass;

			massX = (rightMass - leftMass) / horizRange;
			massY = -(topMass - bottomMass) / vertRange;
		} else {
			massX = 0;
			massY = 0;
		}

		out.write(String.format("{\"massX\":%s, \"massY\":%s}\n",
				String.valueOf(massX), String.valueOf(massY)));
		out.flush();


	}

	@Override
	public void statusReported(BBStatusEvent evt) {
		// TODO Auto-generated method stub

	}

}