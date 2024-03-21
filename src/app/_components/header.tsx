import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar">
      <div className="flex-1">
        <Link className="px-2 text-2xl font-semibold" href="/">
          Gesto
        </Link>
      </div>

      <nav>
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" rel="noreferrer">
              Home
            </Link>
          </li>
          <li>
            <Link href="/restaurants" rel="noreferrer">
              Restaurants
            </Link>
          </li>
          <li>
            <Link href="/about" rel="noreferrer">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" rel="noreferrer">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/signin" rel="noreferrer">
              Sign in
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
